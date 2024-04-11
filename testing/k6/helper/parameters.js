export default {
    discardResponseBodies: true,
    scenarios: {
        contacts: {
            executor: 'per-vu-iterations',
            vus: 10,
            iterations: 20,
            maxDuration: '120s',
        }
    }
}