class Test {
    label;
    func;
    expected;

    
    /**
     * Runs the test and checks the expected value;
     * @param {string} label 
     * @param {() => any} func 
     * @param {...Expected} expected 
     */
    constructor(label, func, ...expected) {
        this.label = label;
        this.func = func;
        this.expected = expected;
        tests.push(this);
    }
}

/**
 * Built-in Expected types
 */
class Headers {
    /**
     * Checks if the response sets the cookie
     * @param {string} cookie 
     * @returns { Expected }
     */
    static SetsCookie(cookie) {
        let state;
        return new Expected(
            (res) => {
                state = res.headers.get('set-cookie');
                return state.split('=')[0] == cookie
            }, () => {
                return `Headers has expected set-cookie (${cookie})`
            }, () => {
                return `Headers does not have expected set-cookie  (expected: ${cookie}, got: ${state.split('=')[0]})`
            }
        )
    }
}

/**
 * Built-in Expected types
 */
class Status {
    /**
     * Checks if the response has the status
     * @param {number} code 
     * @returns { Expected }
     */
    static Is(code) {
        let state;
        return new Expected(
            (res) => {
                state = res.status;
                return state == code;
            }, () => {
                return `Status code was as expected (${code})`
            }, () => {
                return `Status code was not as expected (expected: ${code}, got: ${state})`
            }
        )
    }
}

/**
 * Built-in return checker
 */
class Body {
    /**
     * Checks if the response body has the property
     * @param {string} code 
     * @returns { Expected }
     */
    static HasProperty(property) {
        let state;
        return new Expected(
            async (res) => {
                state = res.body
                return state.hasOwnProperty(property);
            }, () => {
                return `Return body had expected property (${property})`
            }, () => {
                return `Return body didn't have expected property (expected key: ${property}, got: ${Object.keys(state)}})`
            }
        )
    }

    /**
     * Checks if the response body has the value for the given property
     * @param {string} code 
     * @param {any} value 
     * @returns { Expected }
     */
    static HasValue(property, value) {
        let state;
        return new Expected(
            async (res) => {
                state = res.body
                return state.hasOwnProperty(property) && state[property] == value;
            }, () => {
                return `Return body had correct expected value ({${property}: ${value}})`
            }, () => {
                return `Return body didn't have correct expected value (expected ${value}, got: ${state[property]}})`
            }
        )
    }
}


class Expected {
    func;
    good;
    bad;

    constructor(func, good, bad) {
        this.func = func;
        this.good = good;
        this.bad = bad;
    }
}

/** @type {Test[]} */
const tests = [];


/** @type {[boolean, string, string][]} */
const results = [];

/**
 * Runs all registered tests
 */
function run() {
    (async () => {
        for (const test of tests) {
            const result = await test.func();

            for (const expected of test.expected) {
                const testResult = await expected.func(result);

                if (testResult) {
                    results.push([testResult, expected.good(), test.label]);
                } else {
                    results.push([testResult, expected.bad(), test.label]);
                }
            }
        }

        setTimeout(() => {
            let index = 0;
            for (const result of results) {
                console.log(`[ ${result[0]? ++index : index} / ${results.length} ] ${result[2]}: ${result[0] ? '\x1b[32m' : '\x1b[31m'}${result[1]}\x1b[0m`)
            }
        }, 1000)

        
    })();
}

module.exports = { run, Test, Status, Body, Headers };

