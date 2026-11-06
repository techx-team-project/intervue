-- ============================================================================
-- Migration: V20261106001__create_blog_tables.sql
-- Description: Create tables for Blog and Career Guides module
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT DEFAULT NULL,
    icon_name VARCHAR(50) NOT NULL DEFAULT 'BookOpen',
    accent_color VARCHAR(20) NOT NULL DEFAULT '#00b14f',
    banner_gradient VARCHAR(100) DEFAULT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blog_categories_active_order (is_active, display_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL,
    author_id BIGINT UNSIGNED DEFAULT NULL,
    author_name VARCHAR(100) DEFAULT NULL,
    author_avatar VARCHAR(500) DEFAULT NULL,
    author_role VARCHAR(150) DEFAULT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    cover_image_url VARCHAR(500) DEFAULT NULL,
    cover_image_public_id VARCHAR(255) DEFAULT NULL,
    status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    read_time_minutes INT NOT NULL DEFAULT 5,
    views_count BIGINT NOT NULL DEFAULT 0,
    meta_title VARCHAR(255) DEFAULT NULL,
    meta_description VARCHAR(500) DEFAULT NULL,
    published_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_blog_posts_category FOREIGN KEY (category_id) REFERENCES blog_categories (id) ON DELETE RESTRICT,
    CONSTRAINT fk_blog_posts_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_blog_posts_category_status (category_id, status),
    INDEX idx_blog_posts_status_published (status, published_at),
    INDEX idx_blog_posts_featured (is_featured, status),
    INDEX idx_blog_posts_deleted_at (deleted_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(60) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_post_tags (
    post_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    CONSTRAINT fk_blog_post_tags_post FOREIGN KEY (post_id) REFERENCES blog_posts (id) ON DELETE CASCADE,
    CONSTRAINT fk_blog_post_tags_tag FOREIGN KEY (tag_id) REFERENCES blog_tags (id) ON DELETE CASCADE,
    INDEX idx_blog_post_tags_tag (tag_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

