// fetch-review.test.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Mock dependencies before importing the module being tested
jest.mock('axios');
jest.mock('fs');
jest.mock('path');
jest.mock('../secrets/coderabbit');

// Import the module after setting up mocks
const { fetchReviews } = require('./fetch-reviews');

describe('CodeRabbit Review Exporter', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock path.join to return predictable paths
    path.join.mockImplementation((...parts) => parts.join('/'));
    
    // Mock console methods to avoid noise in tests
    console.log = jest.fn();
    console.error = jest.fn();
  });

  test('should exit if API key is missing', async () => {
    // Mock the coderabbit module to return undefined apiKey
    require('../secrets/coderabbit').apiKey = undefined;
    
    // Mock process.exit
    const originalExit = process.exit;
    process.exit = jest.fn();
    
    await fetchReviews('owner/repo');
    
    expect(process.exit).toHaveBeenCalledWith(1);
    
    // Restore process.exit
    process.exit = originalExit;
    
    // Reset the apiKey for other tests
    require('../secrets/coderabbit').apiKey = 'test-api-key';
  });

  test('should create both individual and consolidated files by default', async () => {
    const mockReviews = {
      data: {
        reviews: [
          {
            pull_request_number: 123,
            summary: 'This is a test summary',
            created_at: '2025-05-01T12:00:00Z'
          },
          {
            pull_request_number: 456,
            summary: 'Another test summary',
            created_at: '2025-05-01T13:00:00Z'
          }
        ]
      }
    };
    
    axios.get.mockResolvedValue(mockReviews);
    
    await fetchReviews('test/repo');
    
    // Verify individual files were created
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('coderabbit-summary-123.md'),
      expect.stringContaining('PR #123'),
      'utf8'
    );
    
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('coderabbit-summary-456.md'),
      expect.stringContaining('PR #456'),
      'utf8'
    );
    
    // Verify consolidated summary was created
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('summary.md'),
      expect.stringContaining('# CodeRabbit Review Summaries'),
      'utf8'
    );
  });
  
  test('should only create individual files when specified', async () => {
    const mockReviews = {
      data: {
        reviews: [
          { pull_request_number: 123, summary: 'Test 123', created_at: '2025-05-01T12:00:00Z' },
          { pull_request_number: 456, summary: 'Test 456', created_at: '2025-05-01T13:00:00Z' }
        ]
      }
    };
    
    axios.get.mockResolvedValue(mockReviews);
    
    await fetchReviews('test/repo', null, { individual: true, consolidated: false });
    
    // Verify individual files were created
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('coderabbit-summary-123.md'),
      expect.any(String),
      'utf8'
    );
    
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('coderabbit-summary-456.md'),
      expect.any(String),
      'utf8'
    );
    
    // Verify no calls with summary.md filename
    const summaryMdCalls = fs.writeFileSync.mock.calls.filter(
      call => call[0].includes('summary.md')
    );
    expect(summaryMdCalls.length).toBe(0);
  });
  
  test('should only create consolidated file when specified', async () => {
    const mockReviews = {
      data: {
        reviews: [
          { pull_request_number: 123, summary: 'Test 123', created_at: '2025-05-01T12:00:00Z' },
          { pull_request_number: 456, summary: 'Test 456', created_at: '2025-05-01T13:00:00Z' }
        ]
      }
    };
    
    axios.get.mockResolvedValue(mockReviews);
    
    await fetchReviews('test/repo', null, { individual: false, consolidated: true });
    
    // Verify consolidated summary was created
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('summary.md'),
      expect.any(String),
      'utf8'
    );
    
    // Verify no calls with individual PR filenames
    const individualCalls = fs.writeFileSync.mock.calls.filter(
      call => call[0].includes('coderabbit-summary-')
    );
    expect(individualCalls.length).toBe(0);
  });

  test('should handle empty review list', async () => {
    axios.get.mockResolvedValue({ data: { reviews: [] } });
    
    await fetchReviews('test/repo');
    
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No reviews found'));
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  test('should filter reviews by PR number when provided', async () => {
    const mockReviews = {
      data: {
        reviews: [
          { pull_request_number: 123, summary: 'Test 123', created_at: '2025-05-01T12:00:00Z' },
          { pull_request_number: 456, summary: 'Test 456', created_at: '2025-05-01T13:00:00Z' }
        ]
      }
    };
    
    axios.get.mockResolvedValue(mockReviews);
    
    await fetchReviews('test/repo', '123');
    
    // Verify only the filtered PR was included in individual files
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('coderabbit-summary-123.md'),
      expect.any(String),
      'utf8'
    );
    
    const pr456Calls = fs.writeFileSync.mock.calls.filter(
      call => call[0].includes('coderabbit-summary-456.md')
    );
    expect(pr456Calls.length).toBe(0);
    
    // Verify consolidated summary only includes filtered PR
    const consolidatedCalls = fs.writeFileSync.mock.calls.filter(
      call => call[0].includes('summary.md')
    );
    expect(consolidatedCalls.length).toBe(1);
    expect(consolidatedCalls[0][1]).toContain('PR #123');
    expect(consolidatedCalls[0][1]).not.toContain('PR #456');
  });
});