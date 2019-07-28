package main

import "fmt"

type Salutation struct {    // everything that is Uppercase is public and Lowercase is private
	name string
	greeting string
}

const (
	PI = 3.14
	Lang = "GO"
	A = iota
	B = iota
	C = iota
)

const (
	F = iota // auto increment depends of consand declared
	G
	H
)

func main() {
	fmt.Println(PI,Lang,A,B,C)
	fmt.Println(F,G,H)
}