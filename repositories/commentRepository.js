var Comment = require('../models/comment');

addRoot = function (userid, txt, cb){	
	var comment = new Comment( { userid: userid, txt: txt, lft: 1, rgt: 2 } );
	comment.save(function (err, storedComment){
		cb && cb(err, storedComment);		
	});
}

addLeafAfter = function (userid, txt, childComment, cb){
	var rgt = childComment.rgt;
	addLeaf(userid, txt, rgt, cb);
}

addNewLeaf = function (userid, txt, parentComment, cb){
	var lft = parentComment.lft;
	addLeaf(userid, txt, lft, cb);
}

addLeaf = function (userid, txt, point, cb){	
	Comment.update( { rgt: { $gt: point } }, { $inc: { rgt: 2 } }, {multi: true}, function (err, affected){
		Comment.update( { lft: { $gt: point } }, { $inc: { lft: 2 } }, {multi: true}, function (err, affected){
			var comment = new Comment( { userid: userid, txt: txt, lft: point + 1, rgt: point +2  });
			comment.save(function (err, storedComment){
				cb && cb(err, storedComment);
			});
		});
	});
}


exports.findById = function (id, cb){
	Comment.findOne({ _id: id }, function (err, result){
		cb && cb(err, result);
	})
}

exports.add = function (userId, txt, parentCommentId, cb){

	if (parentCommentId === null){
		addRoot(userId, txt, cb);
		return;
	}

	Comment.findById( parentCommentId, function (err, parentComment){		
		if (parentComment){				
			Comment.findOne({ "lft": { $gt: parentComment.lft }, "rgt": { $lt: parentComment.rgt } }, null, { sort: { rgt: -1 } }, function (err, childComment){								
				if (childComment){									
					addLeafAfter(userId, txt, childComment, cb);
				}else{										
					addNewLeaf(userId, txt, parentComment, cb);
				}
			});
		}else{			
			cb && cb("Parent comment was not found", null);
		}
	});

};

exports.getUsersByCommentsCount = function (cb){
	Comment.aggregate( { $group: { _id: '$userid', count: {$sum: 1} }}, { $sort: {count: -1} } , function (err, result) {		
		cb && cb(err, result);
    });
};

exports.getMaxNestedLevel = function (cb){
	Comment.aggregate( { $project: { lft: 1, rgt: 1, txt: 1, diff: { $subtract: ['$rgt', '$lft'] } } }, { $match: { diff: 1 } }, function (err, comments){	
		var count = 0;
		var max = 0;
		comments.forEach(function (comment){
			Comment.find( { lft: { $lt: comment.lft }, rgt: { $gt: comment.rgt } }, function (err, result){					
				count++;
				if (max < result.length) max = result.length;
				if (comments.length == count){
					cb && cb(err, max);	
				}			
			});
		});
		
	});
}