// import { useLocation } from "react-router-dom";
// // import {
// //   useDeleteSavedPost,
// //   useGetCurrentUser,
// //   useLikePost,
// //   useSavePost,
// // } from "@/lib/react-query/queriesAndMutation";
// import { checkIsLiked } from "@/lib/utils";
// // import type { Models } from "appwrite";
// import { useEffect, useState } from "react";
// import { Loader } from "lucide-react";


// type PostStatsProps = {
//   post: Models.Document;
//   userId : string;
// };

// const PostStats = ({ post, userId }: PostStatsProps) => {
//   // const location = useLocation();
//   const likeslist = post.likes.map((user: Models.Document) => user.$id);

//   const [likes, setLikes] = useState(likeslist);
//   const [isSaved, setIsSaved] = useState(false);

//   const { mutate: likePost } = useLikePost();
//   const { mutate: savePost, isPending : isSavingPost } = useSavePost();
//   const { mutate: deleteSavedPost, isPending : isDeletingSaved } = useDeleteSavedPost();

//   const { data: currentUser } = useGetCurrentUser();

//   const savedPostRecord = currentUser?.savedPosts.find((record: Models.Document) => record.post.$id === post.$id);

//   useEffect(() => {
//     setIsSaved(!!savedPostRecord);
//   }, [currentUser, post]);

//   const handleLikePost = (e: React.MouseEvent) => {
//     e.stopPropagation();

//     let newLikes = [...likes];

//     const hasLiked = newLikes.includes(userId);

//     if (hasLiked) {
//       newLikes = newLikes.filter((id) => id !== userId);
//     } else {
//       newLikes.push(userId);
//     }

//     setLikes(newLikes);
//     likePost({ postId: post.$id, likesArray: newLikes });
//   };

//   const handleSavePost = (e: React.MouseEvent) => {
//     e.stopPropagation();



//     if(savedPostRecord){
//         setIsSaved(false);
//         deleteSavedPost(savedPostRecord.$id);

//         return;
//     } else {
//         savePost({ postId: post.$id, userId });
//         setIsSaved(true);
// }}

//   return (
//     <div className="flex justify-bewteen items-center z-20">
//       <div className="flex gap-2 mr-5">
//        <img
//           src={`${
//             checkIsLiked(likes, userId)
//               ? "/assets/icons/liked.svg"
//               : "/assets/icons/like.svg"
//           }`}
//           alt="like"
//           width={20}
//           height={20}
//           onClick={(e) => handleLikePost(e)}
//           className="cursor-pointer"
//         />
//         <p className="small-medium lg:base-medium">{likes.length}</p>
//       </div>

//       <div className="flex gap-2 ml-[490px]">
//         { isSavingPost || isDeletingSaved ? <Loader/> : <img
//           src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
//           alt="share"
//           width={20}
//           height={20}
//           onClick={(e) => handleSavePost(e)}
//           className="cursor-pointer"
//         />}
//       </div>
//     </div>
//   );
// };

// export default PostStats;
