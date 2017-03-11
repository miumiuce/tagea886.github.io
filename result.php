<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>result</title>
</head>
<body>
	<h1>result</h1>
	<?php
		$searchtype = $_POST['searchtype'];
		$searchterm = trim($_POST['searchterm']);
		if(!$searchtype || !$searchterm){
			echo '打字啊';
			exit;
		}
		
		if(!get_magic_quotes_gpc()){
			$searchtype = addslashes($searchtype);
			$searchterm = addslashes($searchterm);
		}
		
		$db = new mysqli('w.rdc.sae.sina.com.cn','z2zomx1wjx','2324hlj3z01mx3zykiwhl5hij145xh1hl5ix0whz','app_tagea');
		if(mysqli_connect_errno()){
			echo '数据库连接失败';
			exit;
		}
		
		$query = "select * from app_tagea where " . $searchtype . "like '%" . $searchterm . " %' ";
		$result = $db->query($query);
		
		$num_results = $result->num_rows;
		
		echo "<p>number of books found:" . $num_results . "</p>";
		
		for($i=0;$i<$num_results;$i++){
			$row = $result->fetch_assoc();
			echo "<p><strong>" . ($i+1) . " . title: ";
			echo htmlspecialchars(stripslashes($row['title']));
			echo "</strong><br />author:";
			echo stripslashes($row['author']);
			echo "<br />isbn:";
			echo stripslashes($row['isbn']);
			echo "<br />price:";
			echo stripslashes($row['price']);
			echo "</p>";
		}
		
	
	?>
</body>
</html>