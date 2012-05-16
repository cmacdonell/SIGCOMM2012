
html_root = "http://lxwang.users.cs.helsinki.fi/2012/";
logodelay = 30;
logostep = 1;
scrh = $(window).height();
scrw = $(window).width();
logoh = scrh/12 + 30;
logow = Math.max(200, scrw/6);
gidx = 0;
lidx = 0;
lcnt = parseInt(scrw/logow);
showing = Array();

function shuffle(o){
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function init_sps()
{
    shuffle(sps);
    for (var i=1; i<sps.length; i++)
    {
	sps[i][0] = sps[i-1][0] + sps[i][0];
    }
}

function choose_logo_idx()
{
    var idx = -1;
    if (gidx<sps.length)
	idx = gidx;
    else
    {
	var upb = sps[sps.length-1][0] + 1;
	var rdn = parseInt(Math.random()*upb);
	for (var i=0; i<sps.length; i++)
	{
	    if (rdn<=sps[i][0] && sps[i][4]==0)
	    {
		idx = i;
		break;
	    }
	}
	if (idx<0)
	{
	    for (var j=0; j<sps.length; j++)
	    {
		if (sps[j][4]==0)
		{
		    idx = j;
		    break;
		}
	    }
	}
    }
    sps[idx][4] = 1;
    gidx = gidx + 1;
    return idx;
}

$(window).resize(function() {
	scrh = $(window).height();
	scrw = $(window).width();
	logoh = scrh/12 + 30;
	logow = Math.max(200, scrw/6);
	gidx = 0;
	lidx = 0;
	lcnt = parseInt(scrw/logow);
	$("#logobar").html("");
	ticker_tape();
});

function onfinish()
{
    // If there are more pigeon-holes than pigeons.
    if (lcnt >= sps.length)
	return;

    var tid = lidx % lcnt;
    lidx += 1;
    var idx = choose_logo_idx();
    var oidx = parseInt($("#mylogo"+tid).attr("alt"));
    $("#mylogo"+tid).fadeOut(500, function () {
	    sps[oidx][4] = 0;
	    $("#mylogo"+tid).attr("src", "images/" + sps[idx][1]);
	    $("#mylogo"+tid).attr("alt", idx);
	    $("#mylink"+tid).attr("href", sps[idx][2]);
	    var divh = 0.8*logoh;
	    var divw = 0.8*logow;
	    var imgh = parseInt($("#"+sps[idx][3]).attr("data-height"));
	    var imgw = parseInt($("#"+sps[idx][3]).attr("data-width"));
	    if (divh/divw < imgh/imgw)
	    {
		$("#mylogo"+tid).attr("height", divh+"px");
		$("#mylogo"+tid).removeAttr("width");
	    }
	    else
	    {
		$("#mylogo"+tid).removeAttr("height");
		$("#mylogo"+tid).attr("width", divw+"px");
	    }
	    $("#mylogo"+tid).fadeIn(500);
    });

}

function get_logo(tid)
{
    var idx = choose_logo_idx();
    var logoimg = "images/" + sps[idx][1];
    var goldenimg = "";
    var goldenimg_display = "None";
    if (sps[idx][0]>=15)
    {
	goldenimg = "Gold";
	goldenimg_display = "block";
    }

    var divh = 0.8*logoh;
    var divw = 0.8*logow;
    var imgh = parseInt($("#"+sps[idx][3]).attr("data-height"));
    var imgw = parseInt($("#"+sps[idx][3]).attr("data-width"));

    var nlogo = "<td width='" + parseInt(100/lcnt) + "%'>"
	+ "<a id='mylink" + tid + "' href='" + sps[idx][2] + "'>"
	+ "<img id='mylogo" + tid + "' src='" + logoimg + "' alt='" + idx + "' style='display:block; margin:auto;' ";
    if (divh/divw < imgh/imgw)
    {
	nlogo = nlogo + " height='" + divh + "px'>";
    }
    else
    {
	nlogo = nlogo + " width='" + (divw-10) + "px'>";
    }
    nlogo = nlogo + "</a></td>";
    return nlogo;
}

function get_proper_logosize(idx)
{
    var szstr = "";
    var divh = 0.8*logoh;
    var divw = 0.8*logow;
    var imgh = parseInt($("#"+sps[idx][3]).attr("data-height"));
    var imgw = parseInt($("#"+sps[idx][3]).attr("data-width"));
    if (divh/divw < imgh/imgw)
    {
	szstr = " height='" + divh + "px'";
    }
    else
    {
	nlogo = " width='" + divw + "px'";
    }
    return szstr;
}

function ticker_tape()
{
    $("#logobar").css("height", logoh+"px");
    $("#logowht").css("height", logoh+"px");
    $("#logobar").append("<table width='100%' height='100%' cellspacing='0' cellpadding='0' border='0' valign='middle'><tr id='logobarrow'></tr></table>")
    for (var i=0; i<lcnt; i++)
    {
	nlogo = get_logo(i);
	$("#logobarrow").append(nlogo);
    }
}

function showall(divname) {
	$(".newslibtn").find("span").toggleClass("ui-icon-plus");
	$(".newslibtn").find("span").toggleClass("ui-icon-minus");
	if( $(".newsli").css("display") == "none" )
	{
		$(".newsli").css("display", "block");
		$(".newslibtn").find("a").text("less");
	}
	else
	{
		$(".newsli").css("display", "none");
		$(".newslibtn").find("a").text("more");
	}
}

setInterval(function() {
	onfinish();
}, 3000);