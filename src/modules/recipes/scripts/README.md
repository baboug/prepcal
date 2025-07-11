# Recipe Database Seeding Scripts

This directory contains scripts for seeding the recipe database with data from recipe websites.

## Recipe Seeding Script

The `seed-recipes.ts` script scrapes recipes from a website using its sitemap and inserts them into the database.

### Prerequisites

- Node.js 20 or higher
- pnpm
- PostgreSQL database

### Installation

```bash
pnpm install
```

### Configuration

The script is configured using environment variables:

- `SITEMAP_URL` (required): The URL of the sitemap containing recipe links
- `DATABASE_URL` (required): PostgreSQL connection string
- `SCRAPE_CONCURRENCY` (optional): Number of concurrent scraping operations (default: 5, max: 10)
- `BATCH_SIZE` (optional): Number of recipes to process in each batch (default: 100)
- `CLEAR_DATABASE` (optional): Whether to clear existing recipes before seeding (default: false)

### Usage

1. Create a `.env` file with the required configuration:

```env
SITEMAP_URL=https://example.com/sitemap.xml
DATABASE_URL=postgres://user:password@localhost:5432/database
SCRAPE_CONCURRENCY=5
BATCH_SIZE=100
CLEAR_DATABASE=false
```

2. Run the script:

```bash
pnpm recipes:seed
```

### Features

- Concurrent recipe scraping with configurable limits
- Batch processing to handle large sitemaps
- Error handling and logging
- Support for recipe JSON-LD data
- Automatic parsing of ingredients and instructions
- Database schema validation

### Error Handling

The script includes comprehensive error handling:

- Invalid sitemap format
- Failed HTTP requests
- Missing recipe data
- Database connection issues
- Invalid recipe data format

Failed recipe scrapes are logged but don't stop the entire process.

### Performance Optimization

- Concurrent scraping with rate limiting
- Batch processing of recipes
- Efficient database operations
- Memory-efficient streaming of large sitemaps

### Best Practices

The script follows these scraping best practices:

- Respects rate limits through concurrency control
- Handles errors gracefully
- Validates data before insertion
- Logs operations for monitoring
- Cleans up resources properly

### Testing

The script includes comprehensive tests covering:

- Sitemap parsing
- URL filtering
- Recipe scraping
- Database operations
- Error handling

Run tests with:

```bash
pnpm test src/features/recipes/scripts/seed-recipes.test.ts
```
