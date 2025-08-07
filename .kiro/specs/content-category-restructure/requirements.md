# Requirements Document

## Introduction

This feature involves restructuring the content categorization system by removing the current content type-based categories (記事/articles, 動画/videos, 音声/audios) and replacing them with skill-based categories. The change is driven by the evolution of content creation where articles and videos are now published together as unified content pieces, making the previous type-based categorization obsolete.

## Requirements

### Requirement 1

**User Story:** As a website visitor, I want to see skill-based categories on the homepage instead of content type categories, so that I can find relevant business skills content more intuitively.

#### Acceptance Criteria

1. WHEN a user visits the homepage THEN the system SHALL display four skill-based categories: "マネジメントスキル", "基礎ビジネススキル", "思考法", "業務改善"
2. WHEN a user views the navigation THEN the system SHALL NOT display the previous content type categories (記事, 動画, 音声)
3. WHEN a user clicks on a skill-based category THEN the system SHALL show all content (articles, videos, audios) related to that skill category

### Requirement 2

**User Story:** As a content manager, I want to use tags instead of content types for content classification in Contentful, so that I can organize content by business skills rather than media format.

#### Acceptance Criteria

1. WHEN content is created in Contentful THEN the system SHALL use tags for categorization instead of contentType field
2. WHEN existing content is migrated THEN the system SHALL preserve all content while updating the categorization method
3. WHEN content is queried THEN the system SHALL filter by tags rather than contentType

### Requirement 3

**User Story:** As a developer, I want to update the frontend code to use the new categorization system, so that the website reflects the new skill-based organization.

#### Acceptance Criteria

1. WHEN the homepage loads THEN the system SHALL fetch and display content organized by skill tags
2. WHEN category pages are accessed THEN the system SHALL show unified content (articles + videos + audios) for each skill category
3. WHEN navigation is rendered THEN the system SHALL display the four new skill-based categories
4. WHEN content cards are displayed THEN the system SHALL show content type indicators within unified skill categories

### Requirement 4

**User Story:** As a content consumer, I want to access all types of content (articles, videos, audios) within each skill category, so that I can learn from multiple media formats about the same business skill.

#### Acceptance Criteria

1. WHEN a user browses a skill category THEN the system SHALL display articles, videos, and audios together
2. WHEN content is displayed THEN the system SHALL clearly indicate the content type (article, video, audio) within the unified view
3. WHEN a user searches THEN the system SHALL search across all content types within skill categories

### Requirement 5

**User Story:** As a system administrator, I want to ensure backward compatibility during the transition, so that existing URLs and bookmarks continue to work.

#### Acceptance Criteria

1. WHEN old category URLs are accessed THEN the system SHALL redirect to appropriate skill-based categories
2. WHEN content migration occurs THEN the system SHALL maintain all existing content accessibility
3. WHEN the new system is deployed THEN the system SHALL not break any existing functionality