<? include '../php/mysql.php'; ?>
<?
$id = $_GET['id'];
if ($_POST) {
    $query = "UPDATE `projects` SET `name` = '".$_POST['name']."', `url` = '".$_POST['url']."', `md5` = '".$_POST['md5']."', `title_text` = '".$_POST['title_text']."', `text` = '".$_POST['text']."' WHERE `id` = '$id'";
    $result = mysql_query($query);
}

$query = "SELECT * FROM `projects` WHERE `id` = '$id' ORDER BY id DESC LIMIT 1";
$project_items = mysql_query($query, $myConnect);
$item = mysql_fetch_array($project_items);
?>

<!DOCTYPE html>
<html>
<head lang="ru">
    <meta charset="UTF-8">
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link href="/css/styles.css" rel="stylesheet">
</head>
<body>
<header>
    <div class="container">
        <div class="row">
            <h1>Проект <b><?= $item['name'] ?></b></h1>

            <div class="col-md-3"></div>
            <div class="col-md-6">
                <div class="row block bounce animated" ng-hide="form_post && !error_post">
                    <div class="icon_vk">
                        <i class="fa fa-vk"></i>
                    </div>
                    <div class="icon_line-chart">
                        <i class="fa fa-line-chart"></i>
                    </div>
                    <div class="row">
                        <? if ($_POST) {?><h3>Проект успешно сохранен!</h3><? }?>
                        <form action="" method="post">
                            <input class="form-control"
                                   type="text" value="<?= $item['name'] ?>" name="name"><br/>
                            <input class="form-control"
                                   type="text" value="<?= $item['url'] ?>" name="url"><br/>
                            <input class="form-control"
                                   type="text" value="<?= $item['md5'] ?>" name="md5"><br/>
                            <input class="form-control"
                                   type="text" value="<?= $item['title_text'] ?>" name="title_text"><br/>
    <textarea class="form-control"
              name="text"><?= $item['text'] ?></textarea><br/>
                            <input class="btn btn-default" type="submit" value="Сохранить проект">

                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>
</body>
</html>