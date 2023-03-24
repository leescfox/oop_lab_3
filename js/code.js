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

    #reduceFraction() {
        let a = Math.abs(this.#numerator),
            b = Math.abs(this.#denominator),
            smallest = a < b ? a : b
        for (let i = smallest; i > 1; i--) {
            if (this.#numerator % i === 0 && this.#denominator % i === 0) {
                this.#numerator /= i
                this.#denominator /= i
                break
            }
        }
    }

    print() {
        return `${this.#numerator}/${this.#denominator}`
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
    #rank
    #determinant

    constructor() {
        this.volume = 3
        this.matrix = [
            [new Rational(3, 1), new Rational(3, 2), new Rational(2, 3)],
            [new Rational(12, 4), new Rational(6, 4), new Rational(4, 6)],
            [new Rational(1, 2), new Rational(1, 1), new Rational(2, 1)],
        ]
        this.#rank = ""
        this.#determinant = ""
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

    calculateRank() {
        let rank = this.volume,
            matrixCopy = this.#copyMatrix(),
            reduce
        for (let row = 0; row < rank; row++) {
            if (!matrixCopy[row][row].isEqual(0)) {
                for (let col = 0; col < this.volume; col++) {
                    if (col !== row) {
                        let mult = matrixCopy[col][row].divide(
                            matrixCopy[row][row]
                        )
                        for (let i = 0; i < rank; i++) {
                            matrixCopy[col][i] = matrixCopy[col][i].minus(
                                mult.multiply(matrixCopy[row][i])
                            )
                        }
                    }
                }
            } else {
                reduce = true
                for (let i = row + 1; i < this.volume; i++) {
                    if (!matrixCopy[i][row].isEqual(0)) {
                        for (let j = 0; j < rank; j++) {
                            ;[matrixCopy[row][j], matrixCopy[i][j]] = [
                                matrixCopy[i][j],
                                matrixCopy[row][j],
                            ]
                        }
                        reduce = false
                        break
                    }
                }
                if (reduce) {
                    rank--
                    for (let i = 0; i < this.volume; i++) {
                        matrixCopy[i][row] = matrixCopy[i][rank]
                    }
                }
                row--
            }
        }
        this.#rank = rank
        return this.#rank
    }

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
        this.#determinant = det.divide(total)
        return this.#determinant
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
        return this
    }

    show() {
        let matrixOutput = ""
        for (let i = 0; i < this.volume; i++) {
            for (let j = 0; j < this.volume; j++) {
                matrixOutput += `${this.matrix[i][j].print()} `
            }
        }
        return matrixOutput
    }
}

const matrixApp = new Vue({
    el: "#app",
    data: {
        state: "menu",
        menuOptions: [
            "Ввод матрицы",
            "Вычислить детерминант матрицы",
            "Вычислить ранг матрицы",
            "Транспонировать матрицу",
            "Вывод матрицы",
        ],
        input: {
            volumeValue: "",
            volumePattern: /^[1-9]\d*$/,
            volumeBtnDisabled: true,
            volumeSuccess: false,
            matrixArray: [],
        },
        output: {
            headline: "",
            content: "",
        },
        matrix: new Matrix(),
    },
    methods: {
        printMethod() {
            this.matrix.print()
            // this.matr.transpose()
            // this.matr.print()
            // console.log(`det=${this.matr.calculateDeterminant().print()}`)
            // this.matr.print()
            console.log(`rank=${this.matrix.calculateRank()}`)
            console.log(`det=${this.matrix.calculateDeterminant().print()}`)
            this.matrix.print()
        },
        menuMethod(option) {
            switch (option) {
                case 0:
                    this.input.volumeValue = ""
                    this.input.volumeBtnDisabled = true
                    this.input.volumeSuccess = false
                    this.state = "input"
                    break
                case 1:
                    this.output.headline = "Детерминант матрицы"
                    this.output.content = `Детерминант матрицы: ${this.matrix
                        .calculateDeterminant()
                        .print()}`
                    this.state = "output"
                    break
                case 2:
                    this.output.headline = "Ранг матрицы"
                    this.output.content = `Ранг матрицы: ${this.matrix.calculateRank()}`
                    this.state = "output"
                    break
                case 3:
                    this.output.headline = "Транспонирование"
                    this.output.content = `Матрица после транспонирования: ${this.matrix
                        .transpose()
                        .show()}`
                    this.state = "output"
                    break
                case 4:
                    this.output.headline = "Вывод матрицы"
                    this.output.content = `Матрица: ${this.matrix.show()}`
                    this.state = "output"
                    break
            }
        },
        volumeInput(e) {
            this.input.volumeBtnDisabled = !this.input.volumePattern.test(
                e.target.value
            )
        },
        volumeInputSuccess() {
            let temp
            this.matrix.volume = +this.input.volumeValue
            this.input.matrixArray = new Array(this.matrix.volume)
            for (let i = 0; i < this.matrix.volume; i++) {
                temp = new Array(this.matrix.volume)
                for (let j = 0; j < this.matrix.volume; j++) {
                    temp[j] = {
                        value: "",
                        correct: false,
                    }
                }
                this.input.matrixArray[i] = temp
            }
            this.input.volumeSuccess = true
            // теперь создаём таблицу ввода
            // на инпуте проверяем совпадение с паттерном который напишем в объект input{}
        },
    },
})
