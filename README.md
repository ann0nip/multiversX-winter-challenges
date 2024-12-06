# **multiversX-winter-challenges**

## **Prerequisites**

Before running any script in this repository, make sure you have the following:

1. **Node.js Installed**:

    - Ensure you have [Node.js](https://nodejs.org/) installed on your system.
    - Verify installation:
        ```bash
        node -v
        npm -v
        ```

2. **Install Required Package**:
    - This project uses the `@multiversx/sdk-core` package. To install it:
        ```bash
        npm install @multiversx/sdk-core
        ```

---

## **Repository Structure**

Each day's exercise is organized in its own folder:

-   **3December**:

    -   Contains the script for December 3rd.
    -   Example file: `3December/script.js`.

-   **4December**:
    -   Contains the script for December 4th.
    -   Example file: `4December/script.js`.

### In the `3December` folder, there is also an `accounts_results.json` file, where you can find the seed, public address, private address, and the transaction hash, as requested in the exercise. Of course, this is not recommended and is completely insecure, but it is just for example purposes.

## **How to Run a Script**

1. Navigate to the folder for the specific day's exercise:

    ```bash
    cd 3December
    ```

2. Execute the script:

```bash
   node script.js
```
