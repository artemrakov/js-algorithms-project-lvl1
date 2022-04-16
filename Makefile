install: install-deps
	npx simple-git-hooks

build:
	npm run build

run:
	bin/search 10

install-deps:
	npm ci
	make build

test:
	make build
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

publish:
	npm publish

.PHONY: test
