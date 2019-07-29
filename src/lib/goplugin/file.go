package main

import (
	"fmt"
	"io/ioutil"
)

func main() {
	const bytesLimit = 1500
	var cursor = 0
	fileName := "test.txt"
	content, err := ioutil.ReadFile(fileName)
	checkError(err)
	itemsCount := 56489 // len(content) // 564892290
	slice := content[cursor:itemsCount]
	result := string(slice)

	for itemsCount > 0 {
		itemsCount -= bytesLimit
		cursor += bytesLimit

		if itemsCount <= 0 || int(cursor) > int(itemsCount) {
			return
		}

		slice := content[cursor:itemsCount]
		fmt.Println("Read from file:", len(slice), itemsCount)
	}
}

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}