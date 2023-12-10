import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { CommentPayload } from 'src/app/comment/comment.payload';
import { CommentService } from 'src/app/comment/comment.service';
import { PostModel } from 'src/app/shared/post-model';
import { PostService } from 'src/app/shared/post.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  postId: number=-1;
  post: PostModel={
    id:-1,
    postName:'',
    url: '',
    description: '',
    voteCount: -1,
    userName: '',
    subredditName: '',
    commentCount: -1,
    duration: '',
    upVote: false,
    downVote: false
  };

  commentForm: FormGroup=new FormGroup({});
  commentPayload: CommentPayload = new CommentPayload;
  comments: CommentPayload[]=[];

  constructor(private postService: PostService, private activatedRoute: ActivatedRoute, private commentService: CommentService, private router: Router) {
    this.postId=this.activatedRoute.snapshot.params['id'];
    this.commentForm=new FormGroup({
      text: new FormControl('',Validators.required)
    });

    this.commentPayload={
      text:'',
      postId: this.postId
    }
   }

  ngOnInit(): void {
    this.getPostById();
    this.getCommentsForPost();
  }

  private getPostById(){
    this.postService.getPost(this.postId).subscribe(
      (data)=>{
        this.post=data;
      },error=>{
        throwError(error);
      }
    );
  }

  private getCommentsForPost(){
    this.commentService.getAllCommentsForPost(this.postId).subscribe(
      (data)=>{
        this.comments=data;
      },error=>{
        throwError(error);
      }
    )
  }

  postComment(){
    this.commentPayload.text=this.commentForm.get('text')?.value;
    this.commentService.postComment(this.commentPayload).subscribe(
      (data)=>{
        this.commentForm.get('text')?.setValue('');
        this.getCommentsForPost();
      },error=>{
        throwError(error);
      }
    )
  }

}
