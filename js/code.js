class Rational {
    #numerator
    #denominator

    constructor(numerator = 0, denominator = 1) {
        if (denominator < 0) {
            numerator *= -1
            denominator *= -1
        }
        if (numerator === 0) {
            denominator = 1
        }
        this.#numerator = numerator
        this.#denominator = denominator
        this.#reduceFraction()
    }

    print() {
        // console.log(`${this.numerator}/${this.denominator}`) //
        return `${this.#numerator}/${this.#denominator}`
    }

    #reduceFraction() {
        let a = Math.abs(this.#numerator),
            b = Math.abs(this.#denominator),
            smallest = a < b ? a : b
        for (let i = 2; i <= smallest; i++) {
            if (this.#numerator % i === 0 && this.#denominator % i === 0) {
                this.#numerator /= i
                this.#denominator /= i
                smallest /= i
            }
        }
    }

    sum(number) {
        if (!(number instanceof Rational)) {
            number = new Rational(number)
        }
        let numerator =
            this.#numerator * number.#denominator +
            this.#denominator * number.#numerator
        let denominator = this.#denominator * number.#denominator
        return new Rational(numerator, denominator)
    }

    minus(number) {
        if (!(number instanceof Rational)) {
            number = new Rational(number)
        }
        let numerator =
            this.#numerator * number.#denominator -
            this.#denominator * number.#numerator
        let denominator = this.#denominator * number.#denominator
        return new Rational(numerator, denominator)
    }

    multiply(number) {
        if (!(number instanceof Rational)) {
            number = new Rational(number)
        }
        return new Rational(
            this.#numerator * number.#numerator,
            this.#denominator * number.#denominator
        )
    }

    divide(number) {
        if (!(number instanceof Rational)) {
            number = new Rational(number)
        }
        return new Rational(
            this.#numerator * number.#denominator,
            this.#denominator * number.#numerator
        )
    }

    isEqual(number) {
        if (!(number instanceof Rational)) {
            number = new Rational(number)
        }
        return (
            this.#numerator === number.#numerator &&
            this.#denominator === number.#denominator
        )
    }
}

class Matrix {
    constructor() {
        this.volume = 3
        this.matrix = [
            [new Rational(3, 1), new Rational(3, 2), new Rational(2, 3)],
            [new Rational(4, 1), new Rational(3, 4), new Rational(5, 2)],
            [new Rational(1, 2), new Rational(1, 1), new Rational(2, 1)],
        ]
        this.rank = ""
        this.determinant = ""
    }

    #copyMatrix() {
        let row,
            copy = []
        for (let i = 0; i < this.volume; i++) {
            row = []
            for (let j = 0; j < this.volume; j++) {
                row.push(this.matrix[i][j])
            }
            copy.push(row)
        }
        return copy
    }

    // calculateRank() {}

    calculateDeterminant() {
        let matrixCopy = this.#copyMatrix(),
            det = new Rational(1),
            total = new Rational(1),
            temp = Array(this.volume).fill(0)
        let num1, num2, index
        for (let i = 0; i < this.volume; i++) {
            index = i
            while (index < this.volume && matrixCopy[index][i].isEqual(0)) {
                index++
            }
            if (index === this.volume) {
                continue
            }
            if (index !== i) {
                for (let j = 0; j < this.volume; j++) {
                    ;[matrixCopy[index][j], matrixCopy[i][j]] = [
                        matrixCopy[i][j],
                        matrixCopy[index][j],
                    ]
                }
                det = det.multiply(Math.pow(-1, index - i))
            }
            for (let j = 0; j < this.volume; j++) {
                temp[j] = matrixCopy[i][j]
            }
            for (let j = i + 1; j < this.volume; j++) {
                num1 = temp[i]
                num2 = matrixCopy[j][i]
                for (let k = 0; k < this.volume; k++) {
                    matrixCopy[j][k] = num1
                        .multiply(matrixCopy[j][k])
                        .minus(num2.multiply(temp[k]))
                }
                total = total.multiply(num1)
            }
        }
        for (let i = 0; i < this.volume; i++) {
            det = det.multiply(matrixCopy[i][i])
        }
        this.determinant = det.divide(total)
        return this.determinant
    }

    transpose() {
        for (let i = 1; i < this.volume; i++) {
            for (let j = 0; j < i; j++) {
                ;[this.matrix[i][j], this.matrix[j][i]] = [
                    this.matrix[j][i],
                    this.matrix[i][j],
                ]
            }
        }
    }

    print() {
        console.log("Matrix:")
        let row
        for (let i = 0; i < this.volume; i++) {
            row = ""
            for (let j = 0; j < this.volume; j++) {
                row += `${this.matrix[i][j].print()} `
            }
            console.log(row)
        }
        console.log("\n")
    }
}

const matrixApp = new Vue({
    el: "#app",
    data: {
        num: new Rational(15, -56),
        matr: new Matrix(),
    },
    methods: {
        printMethod() {
            this.matr.print()
            this.matr.transpose()
            this.matr.print()
            console.log(`det=${this.matr.calculateDeterminant().print()}`)
            this.matr.print()
        },
    },
})
