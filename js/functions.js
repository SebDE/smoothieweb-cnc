function runCommand(d, b) {
    var a = $("#commandForm");
    d += "\n";
    url = b ? "/command_silent" : "/command";
    var c = $.post(url, d);
    if (!b) {
        c.done(function(e) {
            $("#result").empty();
            $.each(e.split("\n"), function(f) {
                $("#result").append(this + "<br/>")
            })
        })
    }
}

function runCommandSilent(a) {
    runCommand(a, true)
}

function runCommandCallback(c, d) {
    var b = "/command";
    c += "\n";
    var a = $.post(b, c, d)
}

function jogXYClick(a) {
    runCommand("G91 G0 " + a + " F" + document.getElementById("xy_velocity").value + " G90", true)
}

function jogZClick(a) {
    runCommand("G91 G0 " + a + " F" + document.getElementById("z_velocity").value + " G90", true)
}

function extrude(g, d, c) {
    var f = document.getElementById("extrude_length").value;
    var e = document.getElementById("extrude_velocity").value;
    var h = (g.currentTarget.id == "extrude") ? 1 : -1;
    runCommand("G91 G0 E" + (f * h) + " F" + e + " G90", true)
}

function motorsOff(a) {
    runCommand("M18", true)
}

function heatSet(c) {
    var b = (c.currentTarget.id == "heat_set") ? 104 : 140;
    var a = (b == 104) ? document.getElementById("heat_value").value : document.getElementById("bed_value").value;
    runCommand("M" + b + " S" + a, true)
}

function heatOff(b) {
    var a = (b.currentTarget.id == "heat_off") ? 104 : 140;
    runCommand("M" + a + " S0", true)
}

function getTemperature() {
    runCommand("M105", false)
}

function handleFileSelect(a) {
    var d = a.target.files;
    var b = [];
    for (var c = 0, e; e = d[c]; c++) {
        b.push("<li><strong>", escape(e.name), "</strong> (", e.type || "n/a", ") - ", e.size, " bytes, last modified: ", e.lastModifiedDate ? e.lastModifiedDate.toLocaleDateString() : "n/a", "</li>")
    }
    document.getElementById("list").innerHTML = "<ul>" + b.join("") + "</ul>"
}

function upload() {
    $("#progress").empty();
    $("#uploadresult").empty();
    var b = document.getElementById("files").files[0];
    var a = new FileReader();
    a.readAsBinaryString(b);
    a.onloadend = function(c) {
        xhr = new XMLHttpRequest();
        xhr.open("POST", "upload", true);
        xhr.setRequestHeader("X-Filename", b.name);
        XMLHttpRequest.prototype.mySendAsBinary = function(k) {
            var h = new ArrayBuffer(k.length);
            var f = new Uint8Array(h, 0);
            for (var g = 0; g < k.length; g++) {
                f[g] = (k.charCodeAt(g) & 255)
            }
            if (typeof window.Blob == "function") {
                var e = new Blob([h])
            } else {
                var j = new(window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder)();
                j.append(h);
                var e = j.getBlob()
            }
            this.send(e)
        };
        var d = xhr.upload || xhr;
        d.addEventListener("progress", function(i) {
            var f = i.position || i.loaded;
            var h = i.totalSize || i.total;
            var g = Math.round((f / h) * 100);
            $("#progress").empty().append("uploaded " + g + "%")
        });
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    $("#uploadresult").empty().append("Uploaded Ok")
                } else {
                    $("#uploadresult").empty().append("Uploaded Failed")
                }
            }
        };
        xhr.mySendAsBinary(c.target.result)
    }
}

function playFile(a) {
    runCommandSilent("play /sd/" + a)
}

function refreshFiles() {
    document.getElementById("fileList").innerHTML = "";
    runCommandCallback("M20", function(a) {
        $.each(a.split("\n"), function(c) {
            var e = this.trim();
            if (e.match(/\.g(code)?$/)) {
                var d = document.getElementById("fileList");
                var g = d.insertRow(-1);
                var b = g.insertCell(0);
                var f = document.createTextNode(e);
                b.appendChild(f);
                b = g.insertCell(1);
                b.innerHTML = "[<a href='javascript:void(0);' onclick='playFile(\"" + e + "\");'>Play</a>]"
            }
        })
    })
};