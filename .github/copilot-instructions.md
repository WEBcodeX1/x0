## Repository Structure
- `conf/`: External used components configuration
- `config/`: x0 main JSON configuration
- `database/`: Core PostgreSQL x0 base database definition .sql files
- `debian/`: Debuild package metadata
- `doc/`: Sphinx based (*.rst) documentation
- `docker/`: Docker metadata / build and maintain scripts
- `kubernetes/`: Kubernetes infrastructure management
- `modules/`: x0 components
- `python/`: Base x0 Python backend scripts
- `test/`: Test framework, Docker / Selenium based
- `www/`: JavaScript x0 base source files

## Key Guidelines
1. Document public APIs and complex logic. Suggest changes to the `docs/` folder when appropriate
