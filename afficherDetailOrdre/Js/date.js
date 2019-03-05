//in.so
$(document).ready(function() {
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "date-euro-pre": function(e) {
            var t;
            if ("" !== $.trim(e)) {
                var a = $.trim(e).split(" ")
                  , n = void 0 != a[1] ? a[1].split(":") : [0, 0, 0]
                  , o = a[0].split("/");
                t = 1 * (o[2] + o[1] + o[0] + n[0] + n[1] + (void 0 != n[2] ? n[2] : 0))
            } else
                t = 1 / 0;
            return t
        },
        "date-euro-asc": function(e, t) {
            return e - t
        },
        "date-euro-desc": function(e, t) {
            return t - e
        }
    }),
}




//index4
$(document).ready(function() {
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "stringMonthYear-pre": function(e) {
            var t = ["Janvier", "Fevrier", "Mars", "Avril", "Juin", "Julliet", "Août", "Septembre", "Octobre", "Novembre", "Decembre"]
              , r = e.split(" ");
            r[0] = r[0].replace(",", ""),
            r[1] = jQuery.trim(r[1]);
            for (var a = r[1], n = 0, s = 0; s < t.length; s++)
                if (t[s].toLowerCase() == r[0].toLowerCase().substring(0, 3)) {
                    n = s;
                    break
                }
            return new Date(a,n,1)
        },
        "stringMonthYear-asc": function(e, t) {
            return e < t ? -1 : e > t ? 1 : 0
        },
        "stringMonthYear-desc": function(e, t) {
            return e < t ? 1 : e > t ? -1 : 0
        }
    }),
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "date-euro-pre": function(e) {
            var t;
            if ("" !== $.trim(e)) {
                var r = $.trim(e).split(" ")
                  , a = void 0 != r[1] ? r[1].split(":") : [0, 0, 0]
                  , n = r[0].split("/");
                t = 1 * (n[2] + n[1] + n[0] + a[0] + a[1] + (void 0 != a[2] ? a[2] : 0))
            } else
                t = 1 / 0;
            return t
        },
        "date-euro-asc": function(e, t) {
            return e - t
        },
        "date-euro-desc": function(e, t) {
            return t - e
        }
    })
