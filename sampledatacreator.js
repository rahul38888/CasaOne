const CassaoneDao = require('./scripts/casaonedao');

const recreateSampleData = require("./resources/sampledatautil")


recreateSampleData(new CassaoneDao("mongodb://localhost:27017/","casaonedb"));