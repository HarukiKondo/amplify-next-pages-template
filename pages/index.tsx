import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

/**
 * App コンポーネント
 */
export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  /**
   * Todoリストを一覧で取得するメソッド
   */
  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  /**
   * Todoの項目を追加するメソッド
   */
  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  /**
   * Todoの項目を削除するメソッド
   */
  function deleteTodo(id:string) {
    client.models.Todo.delete({id})
  }

  useEffect(() => {
    listTodos();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}`s todos</h1>
          <button 
            onClick={createTodo}
          >
            + new
          </button>
          <ul>
            {todos.map((todo) => (
              <li 
                key={todo.id}
                onClick={() => {deleteTodo(todo.id)}}
              >
                {todo.content}
              </li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/">
              Review next steps of this tutorial.
            </a>
          </div>
          <button 
            onClick={signOut}
          >
            Sign out
          </button>
        </main>
      )}
    </Authenticator>
  );
}
