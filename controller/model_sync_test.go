package controller

import "testing"

func TestModelSyncLocale(t *testing.T) {
	t.Setenv("SYNC_UPSTREAM_BASE", "https://metadata.example/")
	for _, tc := range []struct {
		input string
		want  string
	}{
		{"en", "en"},
		{" EN ", "en"},
		{"zh-CN", "zh-CN"},
		{"zh-cn", "zh-CN"},
		{"zh-TW", "zh-TW"},
		{" ZH-TW ", "zh-TW"},
		{"ja", ""},
		{"ja-JP", ""},
		{"fr", ""},
		{"fr-FR", ""},
		{"", ""},
	} {
		t.Run(tc.input, func(t *testing.T) {
			locale, supported := normalizeLocale(tc.input)
			if locale != tc.want || supported != (tc.want != "") {
				t.Fatalf("normalizeLocale(%q) = (%q, %v), want (%q, %v)", tc.input, locale, supported, tc.want, tc.want != "")
			}
			base := "https://metadata.example/api/"
			if tc.want != "" {
				base += "i18n/" + tc.want + "/"
			}
			modelsURL, vendorsURL := getUpstreamURLs(tc.input)
			if modelsURL != base+"newapi/models.json" || vendorsURL != base+"newapi/vendors.json" {
				t.Fatalf("unexpected upstream URLs for %q: %q, %q", tc.input, modelsURL, vendorsURL)
			}
		})
	}
}
