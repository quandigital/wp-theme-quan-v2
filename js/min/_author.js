function inViewport(){var a=$(window).innerHeight()+$(window).scrollTop();$.each($("#loop article"),function(){var b=parseInt($(this).offset().top,10);a>b?$(this).addClass("shown"):$(this).removeClass("shown")})}$(window).on("load",function(){$("#loop").isotope({itemSelector:"article"}),setTimeout(function(){inViewport(),$("#loop").removeClass("preload")},200)}),$(document).on("mouseover","#loop article",function(){$(this).addClass("focus").css("cursor","pointer"),$(this).siblings().addClass("unfocus")}).on("mouseleave","#loop article",function(){$(this).removeClass("focus"),$(this).siblings().removeClass("unfocus")}).on("click",".user-post",function(){window.location=$(this).find(".postlink").attr("href")}),$(window).smartresize(function(){$("#loop").isotope({itemSelector:"article"}),inViewport()}),$(document).on("scroll",function(){inViewport(),$("#loop article").each(function(){$(this).removeClass("unfocus")})});