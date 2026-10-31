My deployed website is : https://wardpulse2.vercel.app/
# Ward Pulse - Civic Demand & Complaint Prediction Platform



```mermaid
flowchart LR
    A["Raw data<br/>grievances (556,561 rows)<br/>ward_features (198 wards)<br/>wards.geojson<br/>prediction grid (40 wards)"] --> B["Data preparation<br/>count per ward x month x category<br/>zero-fill missing rows"]
    B --> C["Feature engineering<br/>ward ratios, time features,<br/>neighbour rates"]
    C --> D["Train LightGBM<br/>Poisson loss, 5 seeds<br/>156 wards with history"]
    D --> E["Predict 40 unknown wards<br/>x 18 months x 6 categories<br/>= 4,320 rows"]
    E --> F["submission.csv"]
    E --> G["Live API<br/>FastAPI"]
    G --> H["Dashboard<br/>map, filters, ward details"]
```

## 2. What the model learns from

```mermaid
flowchart TD
    subgraph Inputs
        W["Ward attributes<br/>population, area, roads,<br/>streetlights, parks, lakes,<br/>schools, bus stops"]
        R["Derived ratios<br/>roads per sq km<br/>streetlights per 1000 people<br/>park share, lake share"]
        N["Neighbour features<br/>avg complaint rate of<br/>bordering wards (1st ring)<br/>and next ring (2nd ring)"]
        T["Time features<br/>month number, months since Feb 2020,<br/>city-wide rate for that month"]
        L["Location<br/>centroid lat and lon, zone"]
    end
    W --> R
    R --> M["LightGBM<br/>5-seed ensemble"]
    N --> M
    T --> M
    L --> M
    M --> O["Rate per 1000 people"]
    O --> P["x ward population / 1000"]
    P --> Q["Predicted complaint count"]
    M --> S["Spread across 5 models"]
    S --> U["Uncertainty %"]
```

## 3. Neighbour feature logic

```mermaid
flowchart TD
    A["Ward needs a neighbour rate<br/>for a month and category"] --> B{"Do bordering wards<br/>with data exist?"}
    B -- "Yes" --> C["Use average rate of<br/>those bordering wards"]
    B -- "No" --> D{"Do 2nd ring wards<br/>with data exist?"}
    D -- "Yes" --> E["Use average rate of<br/>2nd ring wards"]
    D -- "No" --> F["Use city-wide rate"]
    C --> G["nbr_rate feature"]
    E --> G
    F --> G
```

## 4. Validation: testing on wards the model never saw

```mermaid
flowchart TD
    A["156 wards with history"] --> B["Split wards into 5 folds<br/>whole wards held out"]
    B --> C["Train on 4 folds<br/>about 125 wards"]
    B --> D["Hold out 1 fold<br/>about 31 wards"]
    C --> E["Neighbour features built only<br/>from the 125 visible wards"]
    E --> F["Train model"]
    D --> G["Score months 2024-01 to 2025-06<br/>on held-out wards"]
    F --> G
    G --> H["MAE per fold"]
    H --> I["Average over 5 folds<br/>Model 7.22 vs baseline 9.45"]
```

## 5. System architecture

```mermaid
flowchart LR
    subgraph Colab["Training (Google Colab)"]
        T1["Notebook"] --> T2["ward_pulse_bundle.joblib<br/>models + lookup tables"]
    end
    subgraph Server["Backend server (FastAPI)"]
        S1["predict.py<br/>build_features + models"]
        S2["main.py<br/>API endpoints"]
        S1 --> S2
    end
    subgraph Front["Front end"]
        F1["Leaflet map<br/>OpenStreetMap tiles"]
        F2["Filters and ward panel"]
    end
    T2 --> S1
    S2 <-->|"JSON over HTTP"| F1
    S2 <-->|"JSON over HTTP"| F2
    J["Judges or test clients"] -->|"POST rows or CSV"| S2
```

## 6. Live prediction request

```mermaid
sequenceDiagram
    participant U as User or judge
    participant A as FastAPI main.py
    participant P as predict.py
    participant M as 5 LightGBM models
    U->>A: POST /api/predict/batch with ward_id, month, category
    A->>A: Validate ward, month and category
    A->>P: build_features(rows)
    P->>P: Join ward attributes, neighbour rates, city rate, time features
    P->>M: Predict rate per 1000 people
    M-->>P: 5 predictions per row
    P->>P: Mean x population / 1000 gives count, std gives uncertainty
    P-->>A: predicted_count and pred_std
    A-->>U: JSON with predictions and latency
```

## 7. Dashboard interaction

```mermaid
sequenceDiagram
    participant B as Browser
    participant A as API
    B->>A: GET /api/meta
    A-->>B: categories and months
    B->>A: GET /api/geojson
    A-->>B: ward shapes
    B->>A: GET /api/map with category and month
    A-->>B: predicted demand and uncertainty per ward
    Note over B: Map coloured by predicted demand
    B->>A: GET /api/ward/ID after a click
    A-->>B: category breakdown, monthly trend, neighbours
    B->>A: GET /api/top
    A-->>B: top 10 wards
```

## 8. Experiments and decision

```mermaid
flowchart TD
    A["Baseline: city-average rate<br/>MAE 9.45"] --> B["LightGBM Poisson<br/>MAE 7.22"]
    B --> C["Extra neighbour features<br/>MAE 7.25"]
    B --> D["Smaller trees<br/>MAE 7.28"]
    B --> E["Tweedie loss<br/>MAE 7.18"]
    B --> F["L1 loss<br/>MAE 7.20"]
    B --> G["One model per category<br/>MAE 7.21"]
    B --> H["Blend of models<br/>MAE 7.13 to 7.17"]
    C --> Z["All within about 0.1 of 7.2<br/>difference is noise"]
    D --> Z
    E --> Z
    F --> Z
    G --> Z
    H --> Z
    Z --> K["Decision: keep the simple single model"]
```

## 9. Requirements checklist

```mermaid
flowchart LR
    R1["Required: regression model"] --> D1["Done: LightGBM"]
    R2["Required: map or dashboard"] --> D2["Done: live map and API"]
    R3["Bonus: complaint type breakdown"] --> D3["Done: 6 categories"]
    R4["Bonus: confidence per ward"] --> D4["Done: uncertainty % from ensemble"]
    R5["Bonus: neighbouring wards and map features"] --> D5["Done: 1st and 2nd ring neighbour rates"]
```
