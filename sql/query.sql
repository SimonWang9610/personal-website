SELECT aGuid, a.Subject, a.Category, a.IsPrivated, a.CreationDate, ac.CommentsCount, a.ViewsCount FROM t_article a 
LEFT JOIN (SELECT ArticleGuid, COUNT(Guid) AS CommentsCount FROM t_comment GROUP BY ArticleGuid) AS ac 
ON ac.ArticleGuid = a.Guid 
WHERE a.Category='Daily' ORDER BY a.CreationDate DESC;