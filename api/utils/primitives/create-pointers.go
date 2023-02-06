package primitives

func CreateStringPointer(str string) *string {
	var strPointer *string = new(string)
	*strPointer = str
	return strPointer
}
