# Design Document

## Overview

This design outlines the restructuring of the content categorization system from content type-based categories (記事/articles, 動画/videos, 音声/audios) to skill-based categories (マネジメントスキル, 基礎ビジネススキル, 思考法, 業務改善). The system will transition from using the `contentType` field for categorization to using tags, while maintaining unified content display across all media formats.

## Architecture

### Current System Analysis

The current system uses:
- **Content Type Field**: `contentType` array field with values ['記事', '動画', '音声']
- **Navigation Structure**: Separate routes for `/articles`, `/videos`, `/audios`
- **API Functions**: Separate functions `getArticles()`, `getVideos()`, `getAudios()`
- **Category System**: Existing category system used alongside content types

### New System Architecture

The new system will:
- **Tag-Based Categorization**: Use Contentful tags for skill-based categorization
- **Unified Content Routes**: Single route `/categories/[slug]` for all skill categories
- **Unified API Functions**: Single function `getContentBySkillCategory()` returning mixed content types
- **Content Type Indicators**: Display content type within unified skill category views

## Components and Interfaces

### 1. Frontend Components

#### Header Component Updates
- **Current**: Navigation links to `/articles`, `/videos`, `/audios`, `/categories`
- **New**: Navigation links to skill-based categories: `/categories/management-skills`, `/categories/basic-business-skills`, `/categories/thinking-methods`, `/categories/business-improvement`

#### Homepage Updates
- **Current**: Separate carousels for articles, videos, audios
- **New**: Skill-based carousels showing mixed content types with type indicators

#### Category Page Component
- **Current**: Shows content filtered by category AND content type
- **New**: Shows all content types within a skill category, with clear type indicators

### 2. API Layer Changes

#### New API Functions
```typescript
// Replace separate content type functions with unified skill-based functions
getContentBySkillTag(tagSlug: string, limit?: number, skip?: number): Promise<ContentCollection>
getSkillCategories(): Promise<SkillCategory[]>
```

#### Updated Type Definitions
```typescript
interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tagId: string; // Contentful tag ID
}

interface ContentWithType extends Content {
  displayType: 'article' | 'video' | 'audio'; // Derived from contentType field
}
```

### 3. Contentful Schema Changes

#### Tag Structure
- **Management Skills**: `management-skills` (マネジメントスキル)
- **Basic Business Skills**: `basic-business-skills` (基礎ビジネススキル)
- **Thinking Methods**: `thinking-methods` (思考法)
- **Business Improvement**: `business-improvement` (業務改善)

#### Content Model Updates
- **Keep**: `contentType` field for content type identification
- **Add**: Tags field for skill categorization
- **Migrate**: Existing category associations to appropriate skill tags

## Data Models

### Skill Category Mapping
```typescript
const SKILL_CATEGORIES = {
  'management-skills': {
    name: 'マネジメントスキル',
    slug: 'management-skills',
    description: 'チームマネジメント、リーダーシップに関するスキル'
  },
  'basic-business-skills': {
    name: '基礎ビジネススキル',
    slug: 'basic-business-skills', 
    description: 'ビジネスの基本的なスキルと知識'
  },
  'thinking-methods': {
    name: '思考法',
    slug: 'thinking-methods',
    description: '論理的思考、問題解決の手法'
  },
  'business-improvement': {
    name: '業務改善',
    slug: 'business-improvement',
    description: '効率化、プロセス改善に関するスキル'
  }
};
```

### Content Display Model
```typescript
interface UnifiedContentItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  contentTypes: string[]; // ['記事', '動画', '音声']
  skillCategory: string;
  featuredImage?: Asset;
  publishDate?: string;
  displayOrder?: number;
}
```

## Error Handling

### Migration Error Handling
- **Content Without Tags**: Default to '基礎ビジネススキル' category
- **Invalid Tag References**: Log errors and skip content
- **API Failures**: Graceful degradation with cached content

### Runtime Error Handling
- **Missing Skill Categories**: Show default category list
- **Empty Category Content**: Display appropriate empty state message
- **Tag Query Failures**: Fall back to category-based queries

## Testing Strategy

### Unit Tests
- Test skill category mapping functions
- Test content type detection logic
- Test unified content display components

### Integration Tests
- Test API functions with Contentful tags
- Test navigation flow between skill categories
- Test content migration accuracy

### End-to-End Tests
- Test complete user journey through skill categories
- Test backward compatibility with existing URLs
- Test content accessibility across all skill categories

### Migration Testing
- Test content migration scripts
- Verify no content loss during transition
- Test rollback procedures

## Implementation Phases

### Phase 1: Backend Preparation
- Create skill category tags in Contentful
- Implement unified API functions
- Create content migration scripts

### Phase 2: Frontend Updates
- Update navigation components
- Implement unified category pages
- Update homepage carousels

### Phase 3: Migration & Deployment
- Execute content migration
- Deploy new system
- Implement URL redirects

### Phase 4: Cleanup
- Remove deprecated API functions
- Clean up unused components
- Update documentation