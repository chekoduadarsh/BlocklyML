
"""Plotly Dash HTML layout override."""

html_layout = """
<!DOCTYPE html>
    <html>
        <head>
            {%metas%}
            <title>{%title%}</title>
            {%favicon%}
            {%css%}
        </head>
        <body class="dash-template">
            <header>
              <div class="nav-wrapper">
              <nav class="navbar navbar-light bg-light" >
                    <h3>You Only Plot Once - GUI Demo</h3>
                <li class="nav navbar-nav navbar-right">
                <ul>
                   <a href="https://colab.research.google.com/github/chekoduadarsh/YOPO-You-Only-Plot-Once/blob/master/example.ipynb" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Colaboratory_SVG_Logo.svg" width="48px" height="48px"></a>
                    &nbsp;
                   <a href="https://github.com/chekoduadarsh/YOPO-You-Only-Plot-Once" target="_blank"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="48px" height="48px"></a>
                </ul>
              </nav>
                </br>
                    <h2>CSV Visualizer</h2>
                    </br>
                    <p class="lead">This is a Dash web app which can be used to visualize any CSV. Load the link and Submit!!</p>
                
                <nav>
                </nav>
            </div>
            </header>
            </br>
            {%app_entry%}
            <footer>
                {%config%}
                {%scripts%}
                {%renderer%}

            </footer>
        </body>
    </html>
"""
