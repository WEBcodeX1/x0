# x0 Version 1.0.0 Release Instructions

This document contains the release instructions and materials for x0 version 1.0.0.

## Release Status

- ✅ **debian/changelog** updated with v1.0 entry (dated 2025-09-07)
- ✅ **CHANGELOG.md** updated with [1.0.0] entry (dated 2025-09-07) 
- ✅ **Documentation** updated and standardized
- ✅ **Git tag** prepared locally: `v1.0.0` pointing to commit `ff25abe`
- ⏳ **Git tag** needs to be pushed to GitHub
- ⏳ **GitHub release** needs to be created

## Automatic Release Process

Run the automated release script:

```bash
cd /path/to/x0
./scripts/create-v1.0-release.sh
```

This script will:
1. Create the v1.0.0 git tag (if not exists)
2. Push the tag to GitHub  
3. Provide release notes for creating the GitHub release

## Manual Release Process

If you prefer to do it manually:

### Step 1: Create and Push Git Tag

```bash
# Create the tag pointing to the correct commit
git tag -a v1.0.0 ff25abe -m "Release version 1.0.0

Stable release v1.0 - promoted from release candidate

Key Features:
- Complete GitHub integration with issue templates and workflows
- Comprehensive CHANGELOG.md following Keep a Changelog format
- Documentation improvements and standardization
- Final bug fixes and stabilization for stable release"

# Push the tag
git push origin v1.0.0
```

### Step 2: Create GitHub Release

1. Go to https://github.com/WEBcodeX1/x0/releases/new
2. Select tag: `v1.0.0`
3. Set title: `x0 Version 1.0.0`
4. Use the release notes from the script output or below
5. Uncheck "Pre-release" (mark as stable)
6. Click "Publish release"

## Target Commit

The release tag should point to commit:
- **Commit**: `ff25abe730f2be066282557eebe08c6d0a30bc38`
- **Message**: "Merge pull request #172 from WEBcodeX1/copilot/update-changelog-files"
- **Author**: Claus Prüfer <pruefer@webcodex.de>
- **Date**: Tue Sep 9 08:46:20 2025 +0200

This commit includes all the changelog updates and represents the complete v1.0.0 codebase.

## Release Validation

After creating the release:

1. ✅ Verify tag exists: `git tag -l v1.0.0`
2. ✅ Check GitHub release page: https://github.com/WEBcodeX1/x0/releases/tag/v1.0.0
3. ✅ Confirm release is marked as "Latest" (not pre-release)
4. ✅ Verify release assets are available (source code archives)
5. ✅ Test that documentation links work correctly

## Version History

- **v1.0.0** (2025-09-07): Stable release - this release
- **v1.0rc1** (2025-04-27): Release candidate (existing)
- **v0.99** (2025-03-20): Previous stable version

## Notes

- This release promotes v1.0rc1 to stable status  
- No code changes from the RC, only documentation and release metadata
- Maintains full backward compatibility
- Ready for production use