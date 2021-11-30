// fortune_server.go implements the 'handler' and other functions to return a result of 'Omikuji'.
package xmls

import (
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"bytes"
)

// var resOmikuji = [4]string{"大吉", "中吉", "小吉", "凶"}
// var retXml = []string{}

// Res is a struct for json has one field 'result'.
type Res struct {
	Result string
}

// WeatherHandler implements the 'handler' for the  server.
func WeatherHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "text/xml")

	res, code, err := result()
	if err != nil {
		log.Printf("handler error: %v\ncode: %d\n", err, code)
		http.Error(w, err.Error(), code)
	}
	w.Header().Add("Status Code", "200 OK")
	if _, err := fmt.Fprint(w, res); err != nil {
		http.Error(w, err.Error(), 500)
	}
}

func countQuakeXmls(dir string) ([]string, error) {
	return filepath.Glob(dir + "/32-35_??_??_100*.xml")
}

// result function returns the result of Omikuji if 'i' is bitween 0 and 5, or a empty string.
// If 't' is the first three days of the new year, result function returns always '大吉'
func result() (string, int, error) {
	xmlPaths, err := countQuakeXmls("./jmaxml_20210730_Samples")
	if err != nil {
		return "", 404, err
	}
	idx := rand.Intn(len(xmlPaths))
	f, err := os.OpenFile(xmlPaths[idx], os.O_RDONLY, os.ModePerm)
	if err != nil {
		return "", 404, err
	}
	defer func() {
		if err := f.Close(); err != nil {
			log.Fatal(err)
		}
	}()

	log.Println("open:", xmlPaths[idx])

	res, err := readFile(f)
	if err != nil {
		return "", 500, err
	}

	return res, 200, nil
}

func readFile(f *os.File) (string, error) {
	res := &bytes.Buffer{}
	n, err := io.Copy(res, f)
	if err != nil {
		return "", err
	}
	if n == 0 {
		return "", fmt.Errorf("couldn't read the file")
	}
	return res.String(), nil
}
