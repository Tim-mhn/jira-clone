package http_utils

type HTTPMethod int

const (
	POST HTTPMethod = iota
	GET
	PUT
	DELETE
	PATCH
)

func httpMethodToString(method HTTPMethod) string {
	HTTPMethodToString := map[HTTPMethod]string{
		POST:   "POST",
		GET:    "GET",
		PUT:    "PUT",
		DELETE: "DELETE",
		PATCH:  "PATCH",
	}

	return HTTPMethodToString[method]
}
