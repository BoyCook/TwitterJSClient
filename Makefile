
MOCHA_OPTS=
REPORTER = dot

check: test

test: test-unit

spec: test-spec

test-spec:
	@NODE_ENV=test jasmine-node test/spec --junitreport --forceexit

test-unit:
	@NODE_ENV=test mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

test-cov: lib-cov
	@RPSLP_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

benchmark:
	@./support/bench

clean:
	rm -f coverage.html
	rm -fr lib-cov

.PHONY: test test-unit test-acceptance benchmark clean
