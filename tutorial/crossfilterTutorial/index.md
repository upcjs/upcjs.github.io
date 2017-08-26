#Crossfilter.js入门教程

**作者**：The Myth

**翻译&注释**：段青青，李昕

**网页原址**：

https://www.codeproject.com/articles/693841/making-dashboards-with-dc-js-part-using-crossfil

版权：中国石油大学（华东）可视分析小组

###介绍

[Crossfilter.js](http://square.github.io/crossfilter/)是一个JavaScript插件，用于对JavaScript数组进行切片和分组，是数据之间能进行灵活的交互。 因此`dc.js`和[vega](http://vega.github.io/)等Web端的可视化工具都采用`crossfilter`进行数据交互，它使图表更容易操纵数据，并对过滤后的数据进行刷新。 `Crossfilter`网站的例子是`dc.js`库灵感的来源。

###使用方法

因为大多数实际的Dashboard代码都在操纵图表的数据，所以一旦理解了`crossfilter`的工作原理，实际的绘图就很简单了。本文档将尝试介绍几种不同的场景，这样您就可以在开始使用它的时候避免一些陷阱。

####基本操作

下载的`crossfilter.js`文件来自GitHub，并将其包含在您的HTML页面中。对于这些示例，将使用原始的GitHub源代码作为参考。

```javascript
<script type="text/javascript" src="https://rawgithub.com/NickQiZhu/dc.js/master/web/js/crossfilter.js"></script>
```

首先需要一些数据。下面的数据是从Crossfilter API文档中提取的。

```javascript
var data = [
  {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
  {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash"},
  {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash"},
  {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"}
]; 
```

然后创建一个`crossfilter`实例。

```javascript
var ndx = crossfilter(data);
```

对于第一个示例，我们将使用一个整数列设置一个filter。假设我们想筛选total列为90的数据，需要在total列上设置一个dimension。

```javascript
var totalDim = ndx.dimension(function(d) { return d.total; });   
```

与`d3.js`类似，这里`function(d) { return d.total; }`是一个无名函数，参数d表示一条记录，通过返回值的设定得到针对`total`列的dimension。

####整型数据过滤filter

如果想要找到所有的total等于90的数据，可以按以下方式操作：

```javascript
var total_90 = totalDim.filter(90); 
```

为了查看结果，可以将total_90变量输出到webconsole上。

```javascript
print_filter("total_90"); 
```

输出内容如下：

```javascript
"total_90(6) = [
	{"date":"2011-11-14T17:22:59Z","quantity":2,"total":90,"tip":0,"type":"tab"},
	{"date":"2011-11-14T17:07:21Z","quantity":2,"total":90,"tip":0,"type":"tab"},
	{"date":"2011-11-14T16:58:03Z","quantity":2,"total":90,"tip":0,"type":"tab"},
	{"date":"2011-11-14T16:53:41Z","quantity":2,"total":90,"tip":0,"type":"tab"},
	{"date":"2011-11-14T16:48:46Z","quantity":2,"total":90,"tip":0,"type":"tab"},
	{"date":"2011-11-14T16:30:43Z","quantity":2,"total":90,"tip":0,"type":"tab"}
]"  
```

由于希望能够看到filter是否正常工作，所以创建了一个函数来将数据打印到webconsole中（建议采用chrome浏览器，在调试上既灵活又方便）。

```javascript
function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
} 
```

filter(90)与filterExact(90)表达的含义一致，以下代码的输出结果与filter(90)完全相同：

```javascript
var total_90 = totalDim.filterExact(90); 
print_filter("total_90"); 
```

如果需要过滤一个范围，例如从90到100的范围，可以将参数放在方括号里。范围为左闭右开，因此如果需要在过滤器中包含100，需要把把上限写为101。这与totalDim.filterRange([90,101])的作用相同。

```javascript
var total_90_101= totalDim.filter([90,101]); 
print_filter("total_90_101");  
```

结果为：

```javascript
"total_90_101(7) = [
	{"date":"2011-11-14T16:54:06Z","quantity":1,"total":100,"tip":0,"type":"cash"},	
	{"date":"2011-11-14T17:22:59Z","quantity":2,"total":90,"tip":0,"type":"tab"},	
	{"date":"2011-11-14T17:07:21Z","quantity":2,"total":90,"tip":0,"type":"tab"},	
	{"date":"2011-11-14T16:58:03Z","quantity":2,"total":90,"tip":0,"type":"tab"},	
	{"date":"2011-11-14T16:53:41Z","quantity":2,"total":90,"tip":0,"type":"tab"},	
	{"date":"2011-11-14T16:48:46Z","quantity":2,"total":90,"tip":0,"type":"tab"},	
	{"date":"2011-11-14T16:30:43Z","quantity":2,"total":90,"tip":0,"type":"tab"}
]" 
```

通过自定义过滤函数可以获取更灵活的结果。比如只抓取能被3整除的内容，可以使用如下方法。这种简单的尝试可以直接在chrome浏览器的控制台上直接输入下面两条语句来查看所需数据，方便快捷。

```javascript
var total_3= totalDim.filter(function(d) { if (d%3===0) {return d;} } ); 
print_filter("total_3");
```

结果如下：

```javascript
"total_3(7) = [	
	{"date":"2011-11-14T16:28:54Z","quantity":1,"total":300,"tip":200,"type":"visa"},
	{"date":"2011-11-14T17:22:59Z","quantity":2,"total":90,"tip":0,"type":"tab"},	
	{"date":"2011-11-14T17:07:21Z","quantity":2,"total":90,"tip":0,"type":"tab"},	
	{"date":"2011-11-14T16:58:03Z","quantity":2,"total":90,"tip":0,"type":"tab"},	
	{"date":"2011-11-14T16:53:41Z","quantity":2,"total":90,"tip":0,"type":"tab"},	
	{"date":"2011-11-14T16:48:46Z","quantity":2,"total":90,"tip":0,"type":"tab"},	
	{"date":"2011-11-14T16:30:43Z","quantity":2,"total":90,"tip":0,"type":"tab"}
]" 
```

对数字进行过滤非常简单。但是如果有数据是空值，`crossfilter`将不知道如何处理，因此要确保数据集中没有空值。

####字符串数据过滤filter

如果想找到type列中所有使用visa的所有条目，首先需要创建一个dimension，然后进行过滤。

```javascript
var typeDim  = ndx.dimension(function(d) {return d.type;});
var visa_filter = typeDim.filter("visa"); 
print_filter("visa_filter"); 
```

结果如下：

```javascript
"visa_filter(2) = [	
	{"date":"2011-11-14T17:29:52Z","quantity":1,"total":200,"tip":100,"type":"visa"},
	{"date":"2011-11-14T16:28:54Z","quantity":1,"total":300,"tip":200,"type":"visa"}
]"
```

如果需要获取值为cash的条目也是同样简单的。

```javascript
var cash_filter = typeDim.filter("cash");  
print_filter("cash_filter"); 
```

结果如下：

```javascript
"cash_filter(2) = [	
	{"date":"2011-11-14T17:25:45Z","quantity":2,"total":200,"tip":0,"type":"cash"},	
	{"date":"2011-11-14T16:54:06Z","quantity":1,"total":100,"tip":0,"type":"cash"}
]"
```

下面考虑用`reduceSum`对total列中的cash条目进行求和。这里有一些小问题。 前面我们将type列的dimension设置了过滤器。因此会认为`reduceSum`只针对过滤后的数据。但事实并非如此。 如果采用`group` 函数对过滤后的数据做`reduceSum` ，它不会考虑当前过滤器，而是返回对应关键字的每种类型的总和。这对于`dc.js`来说是有意义的，但不适用于仅想访问cash类型数据的情况。

```javascript
var total = typeDim.group().reduceSum(function(d) {return d.total;});
print_filter("total");
```

> 如果group函数后面不连接其他的函数，它将对当前dimension下的每个类别进行计数。

以下结果可以看出每种类型的总和都被计算出来：

```javascript
"total(3) = [
	{"key":"tab","value":920},
	{"key":"visa","value":500},
	{"key":"cash","value":300}
]"
```

为了获取cash条目的总和，需要采用`crossfilter`中的`groupAll`函数，这个函数会考虑当前所有的过滤器。在此基础上做`reduceSum`可以得到在当前过滤条件下`total`列数据的总和。代码如下：

```javascript
var cash_total = ndx.groupAll().reduceSum(function(d) {return d.total;}).value() 
console.log("cash_total="+cash_total);  
```

因为考虑到了现有的过滤器，因此得到的结果仅为cash条目的总和：

```javascript
"cash_total=300" 
```

请注意对比`group`和`groupAll`两个函数在使用上的区别。

既然`crossfilter`对象观察到了所有的过滤器，那么当决定用cash进行过滤时，为什么它没有观察到visa过滤器呢？而且当想采用以下代码同时获取cash和visa数据时：

```javascript
var cash_and_visa_filter = typeDim.filter(function(d) { if (d ==="visa" || d==="cash") {return d;} });
print_filter("cash_and_visa_filter");
```

cash过滤器仍然起作用，因此结果如下：

```javascript
"cash_and_visa_filter(2) = [
	{"date":"2011-11-14T17:25:45Z","quantity":2,"total":200,"tip":0,"type":"cash"},
	{"date":"2011-11-14T16:54:06Z","quantity":1,"total":100,"tip":0,"type":"cash"}
]" 
```

事实上，当我们想执行这样的操作时，首先要清除已有的过滤器。

> 每次建立新的过滤器前先清除已有的过滤器是一个良好的使用习惯。

```javascript
typeDim.filterAll();	//清除已有的过滤器
var cash_and_visa_filter = typeDim.filter(function(d) { if (d ==="visa" || d==="cash") {return d;} });
print_filter("cash_and_visa_filter");
```

这样就可以得到我们需要的结果：

```javascript
"cash_and_visa_filter(4) = [
	{"date":"2011-11-14T17:29:52Z","quantity":1,"total":200,"tip":100,"type":"visa"},
	{"date":"2011-11-14T16:28:54Z","quantity":1,"total":300,"tip":200,"type":"visa"},
	{"date":"2011-11-14T17:25:45Z","quantity":2,"total":200,"tip":0,"type":"cash"},
	{"date":"2011-11-14T16:54:06Z","quantity":1,"total":100,"tip":0,"type":"cash"}
]" 
```

这样我们就基本了解了`crossfilter`的作用。它最主要的作用是对相应的数据列上建立dimension，然后针对这个dimension做group和filter的操作，从而形成了数据的交互。

 

联系人：李昕                              邮箱：[lix@upc.edu.cn](mailto:lix@upc.edu.cn)

 

 