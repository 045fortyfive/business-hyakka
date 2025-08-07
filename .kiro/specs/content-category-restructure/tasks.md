# Implementation Plan

- [ ] 1. Create skill category constants and types
  - Define SKILL_CATEGORIES constant with the four new categories (マネジメントスキル, 基礎ビジネススキル, 思考法, 業務改善)
  - Create TypeScript interfaces for SkillCategory and UnifiedContentItem
  - Update existing type definitions to support skill-based categorization
  - _Requirements: 2.1, 3.1_

- [ ] 2. Implement unified API functions for skill-based content retrieval
  - Create getContentBySkillTag() function to fetch content by skill tags instead of contentType
  - Implement getSkillCategories() function to return the four skill categories
  - Update getClient() function to handle tag-based queries
  - Write unit tests for new API functions
  - _Requirements: 2.1, 2.2, 3.1_

- [ ] 3. Update Header component navigation
  - Replace content type navigation links (記事, 動画, 音声) with skill category links
  - Update navigation to point to /categories/[skill-slug] routes
  - Maintain responsive design for mobile and desktop navigation
  - Update mobile menu to show skill categories
  - _Requirements: 1.1, 1.2, 3.3_

- [ ] 4. Create unified category page component
  - Implement new category page that displays all content types (articles, videos, audios) for a skill category
  - Add content type indicators within the unified view to distinguish between articles, videos, and audios
  - Update routing to handle skill-based category slugs
  - Implement proper error handling for missing categories
  - _Requirements: 1.3, 4.1, 4.2_

- [ ] 5. Update homepage to use skill-based categorization
  - Modify homepage to fetch content organized by skill tags instead of content types
  - Update category carousels to show mixed content types within skill categories
  - Ensure content type indicators are visible in carousel items
  - Maintain existing hero carousel functionality with skill-based organization
  - _Requirements: 1.1, 3.1, 4.1_

- [ ] 6. Implement content type detection and display logic
  - Create utility functions to determine content type from contentType field
  - Implement content type indicators (badges/icons) for articles, videos, and audios
  - Update ContentCard components to show content type within skill categories
  - Ensure consistent content type display across all components
  - _Requirements: 4.2, 3.3_

- [ ] 7. Update search functionality for skill-based organization
  - Modify searchContent() function to search across skill categories instead of content types
  - Update search results to group by skill categories rather than content types
  - Maintain search functionality across all content types within skill categories
  - Update search UI to reflect skill-based organization
  - _Requirements: 4.3_

- [ ] 8. Implement backward compatibility and URL redirects
  - Create redirect logic for old content type URLs (/articles, /videos, /audios) to appropriate skill categories
  - Implement middleware to handle legacy URL patterns
  - Ensure existing bookmarks continue to work
  - Add proper HTTP status codes for redirects
  - _Requirements: 5.1, 5.3_

- [ ] 9. Update category-related components for skill categories
  - Modify CategorySection component to display skill categories instead of content type categories
  - Update CategoryCarousel component to handle mixed content types
  - Update CategoryTags component to work with skill-based tags
  - Ensure all category components work with the new skill-based system
  - _Requirements: 1.1, 3.1, 4.1_

- [ ] 10. Create content migration utilities (for Contentful)
  - Create utility functions to map existing categories to skill tags
  - Implement data validation for content migration
  - Create backup and rollback procedures for content migration
  - Document migration process for Contentful content management
  - _Requirements: 2.2, 5.2_

- [ ] 11. Update routing and page structure
  - Modify app router structure to support skill-based category routes
  - Update dynamic routing for [slug] pages to handle skill categories
  - Remove or redirect old content type specific routes
  - Ensure proper SEO metadata for skill category pages
  - _Requirements: 1.3, 5.1, 5.3_

- [ ] 12. Write comprehensive tests for the new system
  - Create unit tests for skill category mapping and content type detection
  - Write integration tests for unified API functions
  - Implement end-to-end tests for skill category navigation
  - Test backward compatibility and redirect functionality
  - _Requirements: 2.1, 3.1, 5.1_