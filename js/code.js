class Rational {
    constructor(numerator = 0, denominator = 1) {
        if (denominator < 0) {
            numerator *= -1
            denominator *= -1
        }
        if (numerator === 0) {
            denominator = 1
        }
        this.numerator = numerator
        this.denominator = denominator
        this.reduceFraction()
    }

    print() {
        console.log(`${this.numerator}/${this.denominator}`) //
        return `${this.numerator}/${this.denominator}`
    }

    reduceFraction() {
        let a = Math.abs(this.numerator)
        let b = Math.abs(this.denominator)
        let smallest = a < b ? a : b
        for (let i = 2; i <= smallest; i++) {
            if (a % i === 0 && b % i === 0) {
                this.numerator /= i
                this.denominator /= i
                smallest /= i
            }
        }
    }

    sum(number) {
        if (!(number instanceof Rational)) {
            number = new Rational(number)
        }
        let numerator =
            this.numerator * number.denominator +
            this.denominator * number.numerator
        let denominator = this.denominator * number.denominator
        return new Rational(numerator, denominator)
    }

    minus(number) {
        if (!(number instanceof Rational)) {
            number = new Rational(number)
        }
        let numerator = number.numerator * -1
        return this.sum(new Rational(numerator, number.denominator))
    }

    multiply(number) {
        if (!(number instanceof Rational)) {
            number = new Rational(number)
        }
        return new Rational(
            this.numerator * number.numerator,
            this.denominator * number.denominator
        )
    }

    divide(number) {
        if (!(number instanceof Rational)) {
            number = new Rational(number)
        }
        return new Rational(
            this.numerator * number.denominator,
            this.denominator * number.numerator
        )
    }

    isEqual(number) {
        if (!(number instanceof Rational)) {
            number = new Rational(number)
        }
        return (
            this.numerator === number.numerator &&
            this.denominator === number.denominator
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

    calculateRank() {}

    calculateDeterminant() {
        let det = new Rational(1)
        let total = new Rational(1)
        let temp = Array(this.volume + 1).fill(0)
        let num1, num2, index

        for (let i = 0; i < this.volume; i++) {
            index = i
            while (index < this.volume && this.matrix[index][i].isEqual(0)) {
                index++
            }
            if (index === this.volume) {
                continue
            }
            if (index !== i) {
                for (let j = 0; j < this.volume; j++) {
                    ;[this.matrix[index][j], this.matrix[i][j]] = [
                        this.matrix[i][j],
                        this.matrix[index][j],
                    ]
                }
                det = det.multiply(Math.pow(-1, index - i))
            }
            for (let j = 0; j < this.volume; j++) {
                temp[j] = this.matrix[i][j]
            }
            for (let j = i + 1; j < this.volume; j++) {
                num1 = temp[i]
                num2 = this.matrix[j][i]
                for (let k = 0; k < this.volume; k++) {
                    this.matrix[j][k] = num1
                        .multiply(this.matrix[j][k])
                        .minus(num2.multiply(temp[k]))
                }
                total = total.multiply(num1)
            }
        }
        for (let i = 0; i < this.volume; i++) {
            det = det.multiply(this.matrix[i][i])
        }
        this.determinant = det.divide(total)
        return this.determinant
    }

    transpose() {}
}

const matrixApp = new Vue({
    el: "#app",
    data: {
        num: new Rational(15, -56),
        matr: new Matrix(),
    },
})
