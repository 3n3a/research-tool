package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"

	common "github.com/3n3a/research-tool/lib/common"
	"github.com/3n3a/research-tool/lib/encoding"
)

func SetupEncoding() {
	pageInfo.AddMenuEntry("Base64 Encode", "/encoding", 3)
	app.Get("/encoding", Base64Enc)
	app.Post("/encoding", Base64Enc)
	
	pageInfo.AddMenuEntry("Base64 Decode", "/decoding", 4)
	app.Get("/decoding", Base64Dec)
	app.Post("/decoding", Base64Dec)
}

// Base64
func Base64Enc(c *fiber.Ctx) error {
	base64 := new(encoding.Base64) // input, encoding as fields
	additionalInfo := common.EncodingPage{}

	if c.Method() == "POST" {
		if err := c.BodyParser(base64); err != nil {
			pageInfo.Message = err.Error()
			return common.RenderView(c, pageInfo, additionalInfo, "Base64 Encode", "error")
		}

		fmt.Printf("%#v", base64)
	}

	additionalInfo.BaseType = "Base64"
	additionalInfo.BaseResult = base64.Encode()
	return common.RenderView(c, pageInfo, additionalInfo, "Base64 Encode", "encoding")
}

func Base64Dec(c *fiber.Ctx) error {
	base64 := new(encoding.Base64) // input, encoding as fields
	additionalInfo := common.EncodingPage{}

	if c.Method() == "POST" {
		if err := c.BodyParser(base64); err != nil {
			pageInfo.Message = err.Error()
			return common.RenderView(c, pageInfo, additionalInfo, "Base64 Decode", "error")
		}
	}

	out, err := base64.Decode()
	if err != nil {
		pageInfo.Message = err.Error()
		return common.RenderView(c, pageInfo, additionalInfo, "Base64 Decode", "error")
	}
	additionalInfo.BaseType = "Base64"
	additionalInfo.BaseResult = out
	return common.RenderView(c, pageInfo, additionalInfo, "Base64 Decode", "decoding")
}
