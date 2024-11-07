class DatabaseConnection {
    connect() {
    }
}

class MySQLConnection extends DatabaseConnection {
    connect() {
        console.log("Connecting to MySQL Database");
        return "Mysql Database Connected"
    }
}

class PostgresConnection extends DatabaseConnection {
    connect() {
        console.log("Connecting to Postgres Database");
        return "Postgres Database Connected"

    }
}

class Database {

    constructor(name) {
        this.name = name
    }
    getconnection() {
        let con = null
        switch (this.name) {
            case 'mysql':
                con = new MySQLConnection()
                break;
            case 'postgres':
                con = new PostgresConnection()
                break;
            default:
                con = new MySQLConnection()
                break;
        }
        return con.connect()
    }
}

d1 = new Database('mysql');
console.log(d1.getconnection())