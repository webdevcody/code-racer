import type { Snippet } from "@prisma/client";

export const snippets: {
  code: Snippet["code"];
  language: Snippet["language"];
}[] = [
  {
    code: `void main() {
  printf("Hello, World!");
}`,
    language: "c++",
  },
  {
    code: `class Program {
  static void Main() {
    System.Console.WriteLine("Hello, World!");
  }
}`,
    language: "c#",
  },
  {
    code: `func main() {
  fmt.Println("Hello, World!")
}`,
    language: "go",
  },
  {
    code: `<!DOCTYPE html>
<html>
  <body>
    <script>
      console.log("Hello, World!");
    </script>
  </body>
</html>`,
    language: "html",
  },
  {
    code: `public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
    language: "java",
  },
  {
    code: `console.log("Hello, World!");`,
    language: "javascript",
  },
  {
    code: `<?php
echo "Hello, World!";
?>`,
    language: "php",
  },
  {
    code: `print("Hello, World!")`,
    language: "python",
  },
  {
    code: `puts "Hello, World!"`,
    language: "ruby",
  },
  {
    code: `print("Hello, World!")`,
    language: "swift",
  },
  {
    code: `console.log("Hello, World!");`,
    language: "typescript",
  },
];

export default snippets;
