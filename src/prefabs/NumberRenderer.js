class NumberRenderer {
    constructor(scene, x, y, numbers, maxNumbers) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.numbers = numbers;
        this.maxNumbers = maxNumbers;
        this.numberSprites = [];
        this.updateNumbers(this.numbers);
    }

    updateNumbers(numbers) {
        this.numbers = numbers;
        this.numberString = this.numbers.toString();
        while (this.numberString.length < this.maxNumbers) {
                this.numberString = " " + this.numberString;
        }
        for (let i = 0; i < Math.min(this.numberString.length, this.maxNumbers); i++) {
            if (this.numberSprites[i] != undefined) {
                this.numberSprites[i].destroy();
            }

            if (this.numberString.charAt(i) != " ") {
                this.numberSprites[i] = this.scene.add.sprite(
                                            this.x + 32*i, 
                                            this.y, 
                                            "numbers", 
                                            this.numberString.charAt(i)
                                            ).setOrigin(.5,0);
            }
        }
    }
}