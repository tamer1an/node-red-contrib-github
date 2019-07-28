package main

import (
	"fmt"
	"io/ioutil"
)

func main() {
	fileName := "test.txt"
	content, err := ioutil.ReadFile(fileName)
	slice := content[0:1500]
	checkError(err)
	result := string(slice)
	fmt.Println("Read from file:", result)
}

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}