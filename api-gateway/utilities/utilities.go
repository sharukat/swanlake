package utilities

import (
	"fmt"
	"reflect"
)

func StructToMap(data interface{}) (map[string]string, error) {
	dbMap := make(map[string]string)
	v := reflect.ValueOf(data)
	t := v.Type()

	for i := 0; i < v.NumField(); i++ {
		field := t.Field(i)
		value := v.Field(i)

		// Convert the value to string
		dbMap[field.Tag.Get("json")] = fmt.Sprintf("%v", value.Interface())
	}

	return dbMap, nil
}
