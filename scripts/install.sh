#!/bin/bash

# SeerDB Installation Script for macOS and Linux
# Usage: curl -fsSL https://raw.githubusercontent.com/dancaldera/seerdb/main/scripts/install.sh | bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Banner
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║                  SeerDB Installer                    ║"
echo "║       Terminal Database Explorer for macOS/Linux     ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Detect OS
info "Checking system compatibility..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
    success "System check passed - macOS detected"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
    success "System check passed - Linux detected"
else
    error "Unsupported operating system: $OSTYPE. Please visit: https://github.com/dancaldera/seerdb"
fi

# Check for required commands
info "Checking required commands..."
if ! command -v git >/dev/null 2>&1; then
    if [[ "$OS" == "macOS" ]]; then
        error "git is required but not installed. Please install Xcode Command Line Tools."
    else
        error "git is required but not installed. Please install git using your package manager (e.g., sudo apt install git)"
    fi
fi

# Check if Bun is installed, if not install it
info "Checking for Bun runtime..."
if ! command -v bun &> /dev/null; then
    warning "Bun not found. Installing Bun..."

    # Detect package manager for Linux
    if [[ "$OS" == "Linux" ]]; then
        if command -v apt-get >/dev/null 2>&1; then
            PKG_MANAGER="apt-get"
        elif command -v yum >/dev/null 2>&1; then
            PKG_MANAGER="yum"
        elif command -v dnf >/dev/null 2>&1; then
            PKG_MANAGER="dnf"
        elif command -v pacman >/dev/null 2>&1; then
            PKG_MANAGER="pacman"
        else
            info "Could not detect package manager. Using Bun installer..."
        fi
    fi

    # Install Bun
    curl -fsSL https://bun.sh/install | bash

    # Add Bun to current session
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    success "Bun installed successfully"
else
    success "Bun found - $(bun --version)"
fi

# Create installation directory
INSTALL_DIR="$HOME/.local/bin"
info "Setting up installation directory: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

# Clone or update repository
REPO_DIR="$HOME/.local/share/seerdb"
if [[ -d "$REPO_DIR" ]]; then
    info "Updating existing installation..."
    cd "$REPO_DIR"
    git pull --quiet origin main 2>/dev/null || warning "Could not update repository"
else
    info "Cloning SeerDB repository..."
    git clone --quiet https://github.com/dancaldera/seerdb.git "$REPO_DIR"
    cd "$REPO_DIR"
fi

# Install dependencies
info "Installing dependencies..."
bun install --silent

# Build the project
info "Building SeerDB..."
bun run build --silent 2>&1 | grep -v ">" || true

# Create symlink
SYMLINK_PATH="$INSTALL_DIR/sdb"
info "Creating symlink at $SYMLINK_PATH"
rm -f "$SYMLINK_PATH"
ln -sf "$REPO_DIR/dist/sdb" "$SYMLINK_PATH"

# Add to PATH if not already present
if ! echo "$PATH" | grep -q "$INSTALL_DIR"; then
    info "Adding $INSTALL_DIR to PATH..."

    # Detect shell configuration file based on OS
    SHELL_CONFIG=""
    if [[ "$OS" == "macOS" ]]; then
        # macOS - prioritize zsh, then bash
        if [[ -f "$HOME/.zshrc" ]]; then
            SHELL_CONFIG="$HOME/.zshrc"
        elif [[ -f "$HOME/.zprofile" ]]; then
            SHELL_CONFIG="$HOME/.zprofile"
        elif [[ -f "$HOME/.bash_profile" ]]; then
            SHELL_CONFIG="$HOME/.bash_profile"
        fi
    else
        # Linux - prioritize bash, then zsh
        if [[ -f "$HOME/.bashrc" ]]; then
            SHELL_CONFIG="$HOME/.bashrc"
        elif [[ -f "$HOME/.profile" ]]; then
            SHELL_CONFIG="$HOME/.profile"
        elif [[ -f "$HOME/.bash_profile" ]]; then
            SHELL_CONFIG="$HOME/.bash_profile"
        elif [[ -f "$HOME/.zshrc" ]]; then
            SHELL_CONFIG="$HOME/.zshrc"
        fi
    fi

    if [[ -n "$SHELL_CONFIG" ]]; then
        # Check if PATH already added
        if ! grep -q "$INSTALL_DIR" "$SHELL_CONFIG"; then
            echo "" >> "$SHELL_CONFIG"
            echo "# Added by SeerDB installer" >> "$SHELL_CONFIG"
            echo "export PATH=\"$INSTALL_DIR:\$PATH\"" >> "$SHELL_CONFIG"
            success "PATH updated in $SHELL_CONFIG"
            if [[ "$OS" == "macOS" ]]; then
                warning "Please run 'source $SHELL_CONFIG' or restart your terminal to use sdb"
            else
                warning "Please run 'source $SHELL_CONFIG' or restart your terminal to use sdb"
            fi
        fi
    else
        warning "Could not detect shell configuration file"
        warning "Please add $INSTALL_DIR to your PATH manually:"
        echo "  export PATH=\"$INSTALL_DIR:\$PATH\""
    fi
else
    success "PATH already configured"
fi

# Verify installation
info "Verifying installation..."
if [[ -x "$SYMLINK_PATH" ]]; then
    VERSION=$("$SYMLINK_PATH" --version 2>&1 || echo "unknown")
    success "SeerDB installed successfully!"
    echo ""
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║                    Installation Complete             ║"
    echo "╠══════════════════════════════════════════════════════╣"
    echo "║  Command: sdb                                       ║"
    echo "║  Version: $VERSION"
    echo "╚══════════════════════════════════════════════════════╝"
    echo ""
    info "Quick start:"
    echo "  1. Run: sdb"
    echo "  2. Select your database type"
    echo "  3. Enter connection details"
    echo ""
    info "For more information: https://github.com/dancaldera/seerdb"
    echo ""
else
    error "Installation verification failed"
fi
