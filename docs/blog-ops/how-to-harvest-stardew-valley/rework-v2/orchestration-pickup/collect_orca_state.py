import os
import subprocess


def execute_and_record_orca_command(command_arguments: list[str], stdout_target_path: str, exit_target_path: str) -> None:
    if not command_arguments:
        raise ValueError("command_arguments must not be empty")
    if not stdout_target_path:
        raise ValueError("stdout_target_path must not be empty")
    if not exit_target_path:
        raise ValueError("exit_target_path must not be empty")

    completed_process = subprocess.run(
        command_arguments,
        capture_output=True,
        text=True,
        check=False,
    )

    with open(stdout_target_path, "w", encoding="utf-8") as stdout_file:
        stdout_file.write(completed_process.stdout)

    with open(exit_target_path, "w", encoding="utf-8") as exit_file:
        exit_file.write(f"{completed_process.returncode}\n")

    if completed_process.returncode != 0:
        error_snippet = completed_process.stderr.strip() or completed_process.stdout.strip()
        raise RuntimeError(f"Command {' '.join(command_arguments)} failed with returncode {completed_process.returncode}: {error_snippet}")


def record_run_show(target_directory: str, run_identifier: str) -> None:
    if not os.path.isdir(target_directory):
        raise ValueError(f"target_directory does not exist: {target_directory}")
    if not run_identifier:
        raise ValueError("run_identifier must not be empty")

    stdout_path = os.path.join(target_directory, "run-show.stdout.json")
    exit_path = os.path.join(target_directory, "run-show.exit.txt")
    command = ["orca", "orchestration", "run-show", "--id", run_identifier, "--json"]
    execute_and_record_orca_command(command, stdout_path, exit_path)


def record_task_list(target_directory: str, run_identifier: str) -> None:
    if not os.path.isdir(target_directory):
        raise ValueError(f"target_directory does not exist: {target_directory}")
    if not run_identifier:
        raise ValueError("run_identifier must not be empty")

    stdout_path = os.path.join(target_directory, "task-list.stdout.json")
    exit_path = os.path.join(target_directory, "task-list.exit.txt")
    command = ["orca", "orchestration", "task-list", "--run", run_identifier, "--json"]
    execute_and_record_orca_command(command, stdout_path, exit_path)


def record_worker_list(target_directory: str, run_identifier: str) -> None:
    if not os.path.isdir(target_directory):
        raise ValueError(f"target_directory does not exist: {target_directory}")
    if not run_identifier:
        raise ValueError("run_identifier must not be empty")

    stdout_path = os.path.join(target_directory, "worker-list.stdout.json")
    exit_path = os.path.join(target_directory, "worker-list.exit.txt")
    command = ["orca", "orchestration", "worker-list", "--run", run_identifier, "--limit", "100", "--json"]
    execute_and_record_orca_command(command, stdout_path, exit_path)


def record_gate_list(target_directory: str, run_identifier: str) -> None:
    if not os.path.isdir(target_directory):
        raise ValueError(f"target_directory does not exist: {target_directory}")
    if not run_identifier:
        raise ValueError("run_identifier must not be empty")

    stdout_path = os.path.join(target_directory, "gate-list.stdout.json")
    exit_path = os.path.join(target_directory, "gate-list.exit.txt")
    command = ["orca", "orchestration", "gate-list", "--run", run_identifier, "--json"]
    execute_and_record_orca_command(command, stdout_path, exit_path)


def record_terminal_list(target_directory: str) -> None:
    if not os.path.isdir(target_directory):
        raise ValueError(f"target_directory does not exist: {target_directory}")

    stdout_path = os.path.join(target_directory, "terminal-list.stdout.json")
    exit_path = os.path.join(target_directory, "terminal-list.exit.txt")
    command = ["orca", "terminal", "list", "--json"]
    execute_and_record_orca_command(command, stdout_path, exit_path)


def orchestrate_state_collection() -> None:
    target_directory = os.path.abspath("docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/orchestration-pickup")
    run_identifier = "run_2434613566b2"

    record_run_show(target_directory, run_identifier)
    record_task_list(target_directory, run_identifier)
    record_worker_list(target_directory, run_identifier)
    record_gate_list(target_directory, run_identifier)
    record_terminal_list(target_directory)


if __name__ == "__main__":
    orchestrate_state_collection()
