package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"

	common "github.com/3n3a/research-tool/lib/common"
	"github.com/3n3a/research-tool/lib/encoding"
)

// Base64
func Base64Enc(c *fiber.Ctx) error {
	base64 := new(encoding.Base64) // input, encoding as fields

	if c.Method() == "POST" {
		if err := c.BodyParser(base64); err != nil {
			pageInfo.Message = err.Error()
			return common.RenderView(c, pageInfo, "Base64 Encode", "error")
		}

		fmt.Printf("%#v", base64)
	}

	pageInfo.BaseType = "Base64"
	pageInfo.BaseResult = base64.Encode()
	return common.RenderView(c, pageInfo, "Base64 Encode", "encoding")
}

func Base64Dec(c *fiber.Ctx) error {
	base64 := new(encoding.Base64) // input, encoding as fields

	if c.Method() == "POST" {
		if err := c.BodyParser(base64); err != nil {
			pageInfo.Message = err.Error()
			return common.RenderView(c, pageInfo, "Base64 Decode", "error")
		}
	}

	out, err := base64.Decode()
    if err != nil {
		pageInfo.Message = err.Error()
		return common.RenderView(c, pageInfo, "Base64 Decode", "error")
	}
	pageInfo.BaseType = "Base64"
	pageInfo.BaseResult = out
	return common.RenderView(c, pageInfo, "Base64 Decode", "decoding")
}