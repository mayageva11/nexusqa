.PHONY: app test test-smoke report docker-test clean install

app:
	cd app && npm run dev

test:
	cd tests && npx playwright test

test-smoke:
	cd tests && npx playwright test --grep @smoke

report:
	cd tests && npx playwright show-report

docker-test:
	docker-compose up --abort-on-container-exit tests

clean:
	rm -rf tests/playwright-report tests/allure-results tests/allure-report tests/test-results tests/auth-state app/dist

install:
	cd app && npm ci
	cd tests && npm ci
	cd tests && npx playwright install --with-deps
