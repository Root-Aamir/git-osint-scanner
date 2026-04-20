<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Repository;

class RepositoryController extends Controller
{
    // 1. Naya Repository Add karne ka function
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'path' => 'required|string', // Local folder ka path
        ]);

        $repo = Repository::create([
            'name' => $request->name,
            'path' => $request->path,
            'branch' => $request->branch ?? 'main',
        ]);

        return response()->json(['message' => 'Repo added!', 'data' => $repo]);
    }

    // 2. Git Logs (Commits) fetch karne ka function
    public function getLogs($id)
    {
        $repo = Repository::find($id);
        
        if (!$repo) {
            return response()->json(['error' => 'Repository not found'], 404);
        }

        // WINDOWS FIX: Yahan single quotes ki jagah double quotes lagaye gaye hain
        $command = 'cd ' . escapeshellarg($repo->path) . ' && git log --pretty=format:"%H|%an|%s|%ar" -n 10';
        $output = shell_exec($command);

        if (!$output) {
            return response()->json(['error' => 'No commits found or invalid Git path'], 400);
        }

        // Git log ke text ko clean JSON mein convert karna
        $commits = [];
        $lines = explode("\n", trim($output));
        
        foreach ($lines as $line) {
            $parts = explode('|', $line);
            if (count($parts) >= 4) {
                $commits[] = [
                    'hash' => $parts[0],
                    'author' => $parts[1],
                    'message' => $parts[2],
                    'time' => $parts[3],
                ];
            }
        }

        return response()->json(['repo' => $repo->name, 'commits' => $commits]);
    }
}
