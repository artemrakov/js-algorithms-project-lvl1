install: install-deps
	npx simple-git-hooks

build:
	npm run build

run:
	bin/search 10

install-deps:
	make build
	npm ci

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
