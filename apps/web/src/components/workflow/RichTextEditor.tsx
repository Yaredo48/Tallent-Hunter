'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Underline as UnderlineIcon,
    Link as LinkIcon,
    Heading1,
    Heading2,
    Undo,
    Redo,
    Sparkles,
    Loader2,
    Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSuggestContent, useRewriteContent } from '@/hooks/use-job-descriptions';
import { toast } from 'sonner';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    jobTitle?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Start typing...', jobTitle }: RichTextEditorProps) {
    const suggestMutation = useSuggestContent();
    const rewriteMutation = useRewriteContent();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-input rounded-md overflow-hidden bg-background">
            <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-muted/50">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-muted' : ''}
                    type="button"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-muted' : ''}
                    type="button"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? 'bg-muted' : ''}
                    type="button"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
                    type="button"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                    type="button"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                    type="button"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                    type="button"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    type="button"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    type="button"
                >
                    <Redo className="h-4 w-4" />
                </Button>

                <div className="flex-1" />

                <div className="flex items-center gap-1 border-l pl-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                            if (!jobTitle) return toast.error("Job Title required for AI suggestions");
                            try {
                                const response = await suggestMutation.mutateAsync({
                                    jobTitle,
                                    section: 'responsibilities',
                                });
                                editor.chain().focus().insertContent(response).run();
                                toast.success("AI Suggestions added");
                            } catch (e) { }
                        }}
                        disabled={suggestMutation.isPending}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        title="Suggest Responsibilities"
                    >
                        {suggestMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
                        Suggest
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                            const selection = editor.state.selection;
                            const text = editor.state.doc.textBetween(selection.from, selection.to, ' ');
                            const contentToRewrite = text || editor.getHTML();

                            try {
                                const response = await rewriteMutation.mutateAsync({
                                    content: contentToRewrite,
                                    tone: 'professional'
                                });

                                if (text) {
                                    editor.chain().focus().insertContent(response).run();
                                } else {
                                    editor.chain().focus().setContent(response).run();
                                }
                                toast.success("Content rewritten");
                            } catch (e) { }
                        }}
                        disabled={rewriteMutation.isPending}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Rewrite Selection"
                    >
                        {rewriteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit2 className="h-4 w-4 mr-1" />}
                        Rewrite
                    </Button>
                </div>
            </div>
            <EditorContent
                editor={editor}
                className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none"
            />
        </div>
    );
}
