# sortTable
一个表格排序插件
## HTML
```
<div class="tableSortParent"><!--如果需要显示排序结果条在表格上方则需要这个父class-->
  <div class="table-operate"><!--排序结果条显示-->
      <div class="btn-group" style="float: left">
          <button type="button" class="btn-success">添加课程</button>          
      </div>
      <div class="filter-result"><!--排序结果  点击X可以取消排序-->
          <div class="result-item sort-result dn">
              <span class="result-name"></span>:
              <span class="result-value"></span>
              <span class="btn-close-result"><i class="iconfont icon-cuowu"></i></span>
          </div>
      </div>
  </div>
  <table id="" class="table tableSort">  <!--为需要排序的表格加上tableSort Class 点击表头即可排序-->                       
      <thead class="table-title">
          <tr class="i18n-course-thead">
              <th type="nosort"><input type="checkbox" class="allcheck"></th><!--nosort:不排序 -->
              <th type="string"><span class="th-XXX"></span></th><!--string:排序string型的列 -->
              <th><span class="th-XXX"></span></th><!--不写默认为string型排序 -->
              <th type="ip"><span class="th-XXX"></span></th><!--ip:ip排序-->
              <th type="number"><span class="th-XXX"></span></th><!--number:数字类型排序 -->
              <th type="date"><span class="th-XXX"></span></th><!--date:日期类型排序 日期要存储在data-date属性上面 -->
          </tr>
      </thead>
      <tbody>
          <tr>
              <td><input type="checkbox"></td>
              <td>小河</td>
              <td>财路</td>
              <td>192.168.1.120</td>
              <td>12</td>
              <td data-date="2017-04-28/1493370790088">2017年4月28日</td>
          </tr>
          <tr>
              <td><input type="checkbox"></td>
              <td>大河</td>
              <td>好路</td>
              <td>192.168.1.121</td>
              <td>13</td>
              <td data-date="2017-04-27/1493370790084">2017年4月28日</td>
          </tr>
      </tbody>
  </table>
</div>
```
## 当进行增删查改时要更新表数据。不然点击排序用的缓存数据
```
$(".tableSort").updateTable();
```
