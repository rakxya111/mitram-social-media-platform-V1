import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";

import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import axiosInstance from "@/lib/axios/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type PostFormProps = {
  action: "Create" | "Update";
  post?: {
    id: number;
    caption: string;
    tags: string;
    location?: string;
    image: string;
  };
  onSubmit?: (formData: {
    caption?: string;
    image?: File;
    tags?: string;
    location?: string;
  }) => Promise<void>;
};


const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  useUserContext();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location || "" : "",
      tags: post
        ? Array.isArray(post.tags)
          ? post.tags.join(",")
          : post.tags
        : "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler
const handleSubmit = async (values: z.infer<typeof PostValidation>) => {
  try {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("caption", values.caption);
    formData.append("tags", values.tags);
    formData.append("location", values.location || "");

    // 👇 Only append image if it's newly selected (not from existing post)
    if (values.file && values.file.length > 0) {
      formData.append("image", values.file[0]);
    }

    if (action === "Update" && post) {
      await axiosInstance.put(`posts/${post.id}/update-func/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({ title: "Post updated successfully" });
      navigate(`/posts/${post.id}`);
    } else {
      await axiosInstance.post("posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({ title: "Post created successfully" });
      navigate("/");
    }
  } catch (error: any) {
    toast({
      title: `${action} post failed`,
      description: error.response?.data?.detail || error.message,
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.image || ""}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
