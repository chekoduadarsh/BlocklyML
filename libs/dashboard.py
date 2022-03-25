"""Instantiate a Dash app."""
import numpy as np
import pandas as pd
import dash
from dash import dash_table
from dash import dcc
import plotly.express as px
import json
from dash import html
import dash_daq as daq
from dash.dependencies import Input, Output, State
import string
import random
import urllib.parse
import plotly.graph_objects as go
import dash_bootstrap_components as dbc
from .util import floatNoneConvert, strNoneConvert, otherinputtodict

def dashboardApp(df, dash_app, plotly_config):
    """Create a Plotly Dash dashboard."""

    dropdowns = []
    plot_theme = None
    plotly_color_continuous_scale = None
    if "template" in plotly_config.keys():
      plot_theme = plotly_config["template"]
    if "color_continuous_scale" in plotly_config.keys():
        plotly_color_continuous_scale = plotly_config["color_continuous_scale"]

    tab_style = {
        'borderBottom': '1px solid #d6d6d6',
        'padding': '6px',
        'fontWeight': 'bold',
        'backgroundColor': 'black',
        'color': 'white',
    }

    dropdown_style = {
        'fontWeight': 'bold',
        'backgroundColor': 'black',
        'color': 'white',
    }

    tab_selected_style = {
        'borderTop': '1px solid #d6d6d6',
        'borderBottom': '1px solid #d6d6d6',
        'backgroundColor': '#119DFF',
        'color': 'white',
        'padding': '6px'
    }

    not_mandatory_font_style = {"color": "blue"}
    mandatory_font_style = {"color": "red"}
    mandatory_div_style = {" marginLeft": "1%",
                           "width": "48%", "display": "inline-grid"}
    only_mandatory_div_style = {
        " marginLeft": "1%", "width": "98%", " marginRight": "1%", "display": "inline-grid"}
    not_mandatory_div_style = {
        " marginLeft": "2%", "border-spacing": "2px",  "width": "48%", "display": "inline-grid"}
    left_indent_style = {" marginLeft": "1%", }

    df.insert(0,"Index", df.index)
    
    for column in df.columns:
        dropdowns.append({"label": column, "value": column})

    barmode = [{"label": "stack", "value": "stack"},
               {"label": "group", "value": "group"}]

    regressioon_Algos = [{"label": "Ordinary least squares", "value": "ols"},
                         {"label": "Locally WEighted Scatterplot Smoothing",
                             "value": "lowess"},
                         #                    {"label":"5-Point Moving Averages", "value":"rolling"},
                         #                    {"label":"5-point Exponentially Weighted Moving Average", "value":"ewm"},
                         {"label": "Expanding Mean", "value": "expanding"}, ]
    # Custom HTML layout

    # Create Layout
    dash_app.layout = html.Div([

        dcc.Tabs(id="tabs", value='tab-1',  children=[

            dcc.Tab(label='DataFrame View', value='tab-1', style=tab_style, selected_style=tab_selected_style, children=[
                create_data_table(df)
            ]),
            dcc.Tab(label='Basic Plots', value='tab-basic', style=tab_style, selected_style=tab_selected_style, children=[
                dcc.Tabs(id="tabs-basic",  children=[
                    dcc.Tab(label='Scatter Plot', value='tab-2', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-scatter-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-x-scatter', options=dropdowns, placeholder='Enter X axis Value'),
                            dcc.Dropdown(
                                id='input-y-scatter', options=dropdowns, placeholder='Enter Y axis Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),

                        html.Div(id='input-scatter-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(id='input-color-scatter', options=dropdowns,
                                         placeholder='Enter Color axis Value'),
                            dcc.Dropdown(
                                id='input-size-scatter', options=dropdowns, placeholder='Enter Size axis Value'),
                            dcc.Input(id='input-other-scatter',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),


                        dbc.Button(id='submit-button-scatter',  color="success",
                                   n_clicks=0, children='Submit', style=left_indent_style),

                        dcc.Loading(
                            id="loading-scatter",
                            type="default",
                            children=html.Div(
                                id='output-state-scatter', children=[], style=left_indent_style),
                        ),
                    ]),

                    dcc.Tab(label='Line Plot', value='tab-3', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-line-mandatory', style=mandatory_div_style,  children=[
                            dcc.Dropdown(id='input-x-line', options=dropdowns,
                                         placeholder='Enter X axis Value'),
                            dcc.Dropdown(id='input-y-line', options=dropdowns,
                                         placeholder='Enter Y axis Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),

                        html.Div(id='input-line-not-mandatory', style=not_mandatory_div_style,  children=[
                            dcc.Dropdown(id='input-color-line', options=dropdowns,
                                         placeholder='Enter Color axis Value'),
                            dcc.Dropdown(id='input-line-group-line', options=dropdowns,
                                         placeholder='Enter Line Group Value'),
                            dcc.Input(id='input-other-line',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),


                        dbc.Button(id='submit-button-line', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-line",
                            type="default",
                            children=html.Div(
                                id='output-state-line', children=[], style=left_indent_style),
                        ),
                    ]),

                    dcc.Tab(label='Bar Graph', value='tab-4', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-bar-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(id='input-x-bar', options=dropdowns,
                                         placeholder='Enter X axis Value'),
                            dcc.Dropdown(id='input-y-bar', options=dropdowns,
                                         placeholder='Enter Y axis Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),
                        html.Div(id='input-bar-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(id='input-color-bar', options=dropdowns,
                                         placeholder='Enter Color axis Value'),
                            dcc.Dropdown(id='input-barmode-bar',
                                         options=barmode, placeholder='Enter BarMode'),
                            dcc.Input(id='input-other-bar',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-bar', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-bar",
                            type="default",
                            children=html.Div(
                                id='output-state-bar', children=[], style=left_indent_style),
                        ),
                    ]),

                    dcc.Tab(label='Pie Chart', value='tab-pie', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-pie-mandatory', style=mandatory_div_style,  children=[
                            dcc.Dropdown(id='input-x-pie', options=dropdowns,
                                         placeholder='Enter X axis Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),
                        html.Div(id='input-pie-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-names-pie', options=dropdowns, placeholder='Enter names Value'),
                            dcc.Input(id='input-other-pie',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-pie', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-pie",
                            type="default",
                            children=html.Div(
                                id='output-state-pie', children=[], style=left_indent_style),
                        ),
                    ]),

                    dcc.Tab(label='Tree Map', value='tab-6', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-tree-mandatory', style=mandatory_div_style,  children=[
                            dcc.Dropdown(id='input-x-tree', options=dropdowns,
                                         placeholder='Enter Tree Path', multi=True),
                            dcc.Dropdown(
                                id='input-value-tree', options=dropdowns, placeholder='Enter Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),
                        html.Div(id='input-tree-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-color-tree', options=dropdowns, placeholder='Enter Color Value'),
                            dcc.Input(id='input-other-tree',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-tree', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-tree",
                            type="default",
                            children=html.Div(
                                id='output-state-tree', children=[], style=left_indent_style),
                        ),
                    ]),

                    dcc.Tab(label='Sunburst Chart', value='tab-7', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-sunburst-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(id='input-x-sun', options=dropdowns,
                                         placeholder='Enter Chart Path', multi=True),
                            dcc.Dropdown(
                                id='input-value-sun', options=dropdowns, placeholder='Enter Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),
                        html.Div(id='input-sunburst-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-color-sun', options=dropdowns, placeholder='Enter Color Value'),
                            dcc.Input(id='input-other-sun',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-sun', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-sun",
                            type="default",
                            children=html.Div(
                                id='output-state-sun', children=[], style=left_indent_style),
                        ),
                    ]),
                ]),
            ]),
            dcc.Tab(label='Statistical Plots', value='tab-stat', style=tab_style, selected_style=tab_selected_style, children=[
                dcc.Tabs(id="tabs-stat", children=[
                    dcc.Tab(label='Box Plot', value='tab-8', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-box-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(id='input-x-box', options=dropdowns,
                                         placeholder='Enter X axis Value'),
                            dcc.Dropdown(id='input-y-box', options=dropdowns,
                                         placeholder='Enter Y axis Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),
                        html.Div(id='input-box-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(id='input-color-box', options=dropdowns,
                                         placeholder='Enter Color axis Value'),
                            dcc.Input(id='input-other-box',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-box', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-box",
                            type="default",
                            children=html.Div(
                                id='output-state-box', children=[], style=left_indent_style),
                        ),
                    ]),

                    dcc.Tab(label='Histogram', value='tab-9', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-hist-madatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-x-hist', options=dropdowns, placeholder='X axis value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),
                        html.Div(id='input-hist-not-madatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-color-hist', options=dropdowns, placeholder='Enter Color Value'),
                            dcc.Input(id='input-other-hist',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-hist', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-hist",
                            type="default",
                            children=html.Div(
                                id='output-state-hist', children=[], style=left_indent_style),
                        ),
                    ]),

                    dcc.Tab(label='Area Plot', value='tab-area', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-area-mandatory', style=mandatory_div_style,  children=[
                            dcc.Dropdown(id='input-x-area', options=dropdowns,
                                         placeholder='Enter X axis Value'),
                            dcc.Dropdown(id='input-y-area', options=dropdowns,
                                         placeholder='Enter Y axis Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),

                        html.Div(id='input-area-not-mandatory', style=not_mandatory_div_style,  children=[
                            dcc.Dropdown(id='input-color-area', options=dropdowns,
                                         placeholder='Enter Color axis Value'),
                            dcc.Dropdown(id='input-line-group-area', options=dropdowns,
                                         placeholder='Enter Line Group Value'),
                            dcc.Input(id='input-other-area',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),


                        dbc.Button(id='submit-button-area', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-area",
                            type="default",
                            children=html.Div(
                                id='output-state-area', children=[], style=left_indent_style),
                        ),
                    ]),

                    dcc.Tab(label='HeatMap', value='tab-10', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-heatmap-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-x-heat', options=dropdowns, placeholder='X axis value'),
                            dcc.Dropdown(
                                id='input-y-heat', options=dropdowns, placeholder='Y axis value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),
                        html.Div(id='input-heatmap-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-color-heat', options=dropdowns, placeholder='Enter Z Value'),
                            dcc.Input(id='input-other-heat',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-heat', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-heat",
                            type="default",
                            children=html.Div(
                                id='output-state-heat', children=[], style=left_indent_style),
                        ),
                    ]),

                    dcc.Tab(label='Violin Plot', value='tab-11', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-violin-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-x-violin', options=dropdowns, placeholder='X axis value'),
                            dcc.Dropdown(
                                id='input-y-violin', options=dropdowns, placeholder='Y axis value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),
                        html.Div(id='input-violoin-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-color-violin', options=dropdowns, placeholder='Enter Color Value'),
                            dcc.Input(id='input-other-violin',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-violin', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-violin",
                            type="default",
                            children=html.Div(
                                id='output-state-violin', children=[], style=left_indent_style),
                        ),
                    ]),
                ]),
            ]),
            dcc.Tab(label='Geological Plots', value='tab-geo', style=tab_style, selected_style=tab_selected_style, children=[
                dcc.Tabs(id="geo-stat", children=[
                    dcc.Tab(label='Map Density Heatmap', value='tab-map-density', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-map-density-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-map-density-lat', options=dropdowns, placeholder='Enter Latitude Value'),
                            dcc.Dropdown(
                                id='input-map-density-lon', options=dropdowns, placeholder='Enter Longitude Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),

                        html.Div(id='input-map-density-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(id='input-map-density-mag',
                                         options=dropdowns, placeholder='Enter z Value'),
                            dcc.Input(id='input-map-density-radius',
                                      placeholder='Enter radius Value'),
                            dcc.Input(id='input-other-map-density',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-map-density', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-map-density",
                            type="default",
                            children=html.Div(
                                id='output-state-map-density', children=[], style=left_indent_style),
                        ),


                    ]),
                    dcc.Tab(label='Line on Maps Heatmap', value='tab-map-line', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-map-line-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(id='input-map-line-location',
                                         options=dropdowns, placeholder='Enter Loaction Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),

                        html.Div(id='input-map-line-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-map-line-color', options=dropdowns, placeholder='Enter Color Value'),
                            dcc.Input(id='input-other-map-line',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-map-line', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-map-line",
                            type="default",
                            children=html.Div(
                                id='output-state-map-line', children=[], style=left_indent_style),
                        ),

                    ]),
                    dcc.Tab(label='Scatterplot on Maps', value='tab-map-scatter', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-map-scatter-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(id='input-map-scatter-location',
                                         options=dropdowns, placeholder='Enter Loaction Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                            #dcc.Dropdown(id='input-map-scatter-lat', options=dropdowns, placeholder='Enter Latitude Value'),
                            # dcc.Dropdown(id='input-map-scatter-lon', options=dropdowns, placeholder='Enter Longitude Value'), #disabled due to mapbox token
                        ]),

                        html.Div(id='input-map-scatter-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(id='input-map-scatter-color',
                                         options=dropdowns, placeholder='Enter Color Value'),
                            dcc.Dropdown(
                                id='input-map-scatter-size', options=dropdowns, placeholder='Enter Size Value'),
                            dcc.Input(id='input-other-map-scatter',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-map-scatter', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-map-scatter",
                            type="default",
                            children=html.Div(
                                id='output-state-map-scatter', children=[], style=left_indent_style),
                        ),

                    ]),
                ]),
            ]),
            dcc.Tab(label='Financial Charts ', value='tab-fin', style=tab_style, selected_style=tab_selected_style, children=[
                dcc.Tabs(id="tabs-fin", children=[
                    dcc.Tab(label='Candlestick Chart', value='tab-candlestick', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-candlestick-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-candlestick-date', options=dropdowns, placeholder='Enter Date Value'),
                            dcc.Dropdown(
                                id='input-candlestick-open', options=dropdowns, placeholder='Enter Open Value'),
                            dcc.Dropdown(
                                id='input-candlestick-high', options=dropdowns, placeholder='Enter High Value'),
                            dcc.Dropdown(
                                id='input-candlestick-low', options=dropdowns, placeholder='Enter Low Value'),
                            dcc.Dropdown(id='input-candlestick-close',
                                         options=dropdowns, placeholder='Enter Close Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),

                        html.Div(id='input-candlestick-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Input(id='input-other-candlestick',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),
                        dbc.Button(id='submit-button-candlestick', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-candlestick",
                            type="default",
                            children=html.Div(
                                id='output-state-candlestick', children=[], style=left_indent_style),
                        ),
                    ]),
                    dcc.Tab(label='OHLC Chart', value='tab-ohlc', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-ohlc-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-ohlc-date', options=dropdowns, placeholder='Enter Date Value'),
                            dcc.Dropdown(
                                id='input-ohlc-open', options=dropdowns, placeholder='Enter Open Value'),
                            dcc.Dropdown(
                                id='input-ohlc-high', options=dropdowns, placeholder='Enter High Value'),
                            dcc.Dropdown(
                                id='input-ohlc-low', options=dropdowns, placeholder='Enter Low Value'),
                            dcc.Dropdown(
                                id='input-ohlc-close', options=dropdowns, placeholder='Enter Close Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),

                        html.Div(id='input-ohlc-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Input(id='input-other-ohlc',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),
                        dbc.Button(id='submit-button-ohlc', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-ohlc",
                            type="default",
                            children=html.Div(
                                id='output-state-ohlc', children=[], style=left_indent_style),
                        ),
                    ]),
                ]),
            ]),
            dcc.Tab(label='Scientific Charts ', value='tab-sci', style=tab_style, selected_style=tab_selected_style, children=[
                dcc.Tabs(id="tabs-sci", children=[
                    dcc.Tab(label='Ternary Plots', value='tab-ternary', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-ternary-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-a-ternary', options=dropdowns, placeholder='Enter A corner Value'),
                            dcc.Dropdown(
                                id='input-b-ternary', options=dropdowns, placeholder='Enter B corner Value'),
                            dcc.Dropdown(
                                id='input-c-ternary', options=dropdowns, placeholder='Enter C corner Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),

                        html.Div(id='input-ternary-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-color-ternary', options=dropdowns, placeholder='Enter Color Value'),
                            dcc.Dropdown(
                                id='input-size-ternary', options=dropdowns, placeholder='Enter Size Value'),
                            dcc.Input(id='input-other-ternary',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),


                        dbc.Button(id='submit-button-ternary', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-ternary",
                            type="default",
                            children=html.Div(
                                id='output-state-ternary', children=[], style=left_indent_style),
                        ),
                    ]),
                    dcc.Tab(label='Polar Charts', value='tab-polar', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-polar-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-r-polar', options=dropdowns, placeholder='Enter R Value'),
                            dcc.Dropdown(
                                id='input-theta-polar', options=dropdowns, placeholder='Enter Theta Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),

                        html.Div(id='input-polar-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-color-polar', options=dropdowns, placeholder='Enter Color Value'),
                            dcc.Dropdown(
                                id='input-size-polar', options=dropdowns, placeholder='Enter Size Value'),
                            dcc.Dropdown(
                                id='input-symbol-polar', options=dropdowns, placeholder='Enter Symbol Value'),
                            dcc.Input(id='input-other-polar',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),


                        dbc.Button(id='submit-button-polar', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-polar",
                            type="default",
                            children=html.Div(
                                id='output-state-polar', children=[], style=left_indent_style),
                        ),
                    ]),
                    dcc.Tab(label='Streamtube', value='tab-streamtube', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-streamtube-mandatory', style=mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-x-streamtube', options=dropdowns, placeholder='Enter X Value'),
                            dcc.Dropdown(
                                id='input-y-streamtube', options=dropdowns, placeholder='Enter Y Value'),
                            dcc.Dropdown(
                                id='input-z-streamtube', options=dropdowns, placeholder='Enter Z Value'),
                            dcc.Dropdown(
                                id='input-u-streamtube', options=dropdowns, placeholder='Enter U Value'),
                            dcc.Dropdown(
                                id='input-v-streamtube', options=dropdowns, placeholder='Enter V Value'),
                            dcc.Dropdown(
                                id='input-w-streamtube', options=dropdowns, placeholder='Enter W Value'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),

                        html.Div(id='input-streamtube-not-mandatory', style=not_mandatory_div_style, children=[
                            dcc.Input(id='input-other-streamtube',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),

                        dbc.Button(id='submit-button-streamtube', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-streamtube",
                            type="default",
                            children=html.Div(
                                id='output-state-streamtube', children=[], style=left_indent_style),
                        ),
                    ]),
                ]),
            ]),
            dcc.Tab(label='Trend Line', value='tab-trend', style=tab_style, selected_style=tab_selected_style, children=[
                dcc.Tabs(id="tabs-trend", children=[
                    dcc.Tab(label='Regressions', value='tab-8', style=tab_style, selected_style=tab_selected_style, children=[

                        html.Div(id='input-12', style=mandatory_div_style, children=[
                            dcc.Dropdown(
                                id='input-x-regscatter', options=dropdowns, placeholder='Enter X axis Value'),
                            dcc.Dropdown(
                                id='input-y-regscatter', options=dropdowns, placeholder='Enter Y axis Value'),
                            dcc.Dropdown(id='input-reg-regscatter', options=regressioon_Algos,
                                         placeholder='Enter Regression Algorithmm'),
                            html.P("* Mandatory Inputs",
                                   style=mandatory_font_style),
                        ]),

                        html.Div(id='input-20', style=not_mandatory_div_style, children=[
                            dcc.Dropdown(id='input-color-regscatter', options=dropdowns,
                                         placeholder='Enter Color axis Value'),
                            dcc.Dropdown(
                                id='input-size-regscatter', options=dropdowns, placeholder='Enter Size axis Value'),
                            dcc.Input(id='input-other-regscatter',
                                      placeholder='Enter Other parameters'),
                            html.P("* Optional Inputs",
                                   style=not_mandatory_font_style),
                        ]),


                        dbc.Button(id='submit-button-regscatter', n_clicks=0,
                                   children='Submit', color="success", style=left_indent_style),

                        dcc.Loading(
                            id="loading-regscatter",
                            type="default",
                            children=html.Div(
                                id='output-state-regscatter', children=[], style=left_indent_style),
                        ),

                    ]),
                ]),
            ]),
            dcc.Tab(label='Custom Plots', value='tab-custom', style=tab_style, selected_style=tab_selected_style, children=[

                html.Div(id='input-custom-mandatory', children=[
                    html.Code(id='custom', children=[dcc.Textarea(id='input-custom-code', placeholder="use variable 'df' as datta frame and export plotly figure to variable 'fig'", style={" marginLeft": "1%", "width": "98%", " marginRight": "1%", 'height': 300}),
                                                     ]), ]),
                dbc.Button(id='submit-button-custom', n_clicks=0,
                           children='Submit', color="success", style=left_indent_style),

                dcc.Loading(
                    id="loading-custom",
                    type="default",
                    children=html.Div(id='output-state-custom',
                                      children=[], style=left_indent_style),
                ),
            ]),
        ]),
        html.Div(id='tabs-content')
    ])

    @dash_app.callback(Output('output-state-scatter', 'children'),
                       Input('submit-button-scatter', 'n_clicks'),
                       State('input-x-scatter', 'value'),
                       State('input-y-scatter', 'value'),
                       State('input-color-scatter', 'value'),
                       State('input-size-scatter', 'value'),
                       State('input-other-scatter', 'value'))
    def update_scatterplot(n_clicks, input1, input2, input3, input4, input5):
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns:

            input_parametes = {"x": strNoneConvert(input1),
                               "y": strNoneConvert(input2),
                               "color": strNoneConvert(input3),
                               "size": strNoneConvert(input4),
                               "template": plot_theme, 
                               "color_continuous_scale": plotly_color_continuous_scale}
            input_parametes.update(otherinputtodict(input5))

            fig = px.scatter(df, **input_parametes)
            return dcc.Graph(
                id='graph-1-tabs',
                figure=fig
            )

        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-line', 'children'),
                       Input('submit-button-line', 'n_clicks'),
                       State('input-x-line', 'value'),
                       State('input-y-line', 'value'),
                       State('input-color-line', 'value'),
                       State('input-line-group-line', 'value'),
                       State('input-other-line', 'value'))
    def update_lineplot(n_clicks, input1, input2, input3, input4, input5):
        input4 = None
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns:

            input_parametes = {"x": strNoneConvert(input1),
                               "y": strNoneConvert(input2),
                               "color": strNoneConvert(input3),
                               "line_group": strNoneConvert(input4),
                               "template": plot_theme, 
                               "color_continuous_scale": plotly_color_continuous_scale}

            input_parametes.update(otherinputtodict(input5))

            fig = px.line(df, **input_parametes)
            return dcc.Graph(
                id='graph-line-tabs',
                figure=fig
            )
        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-bar', 'children'),
                       Input('submit-button-bar', 'n_clicks'),
                       State('input-x-bar', 'value'),
                       State('input-y-bar', 'value'),
                       State('input-color-bar', 'value'),
                       State('input-barmode-bar', 'value'),
                       State('input-other-bar', 'value'))
    def update_barplot(n_clicks, input1, input2, input3, input4, input5):
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns:

            input_parametes = {"x": strNoneConvert(input1),
                               "y": strNoneConvert(input2),
                               "color": strNoneConvert(input3),
                               "barmode": strNoneConvert(input4),
                               "template": plot_theme,
                               "color_continuous_scale": plotly_color_continuous_scale}

            input_parametes.update(otherinputtodict(input5))

            fig = px.bar(df, **input_parametes)
            return dcc.Graph(
                id='graph-bar-tabs',
                figure=fig
            )

        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-pie', 'children'),
                       Input('submit-button-pie', 'n_clicks'),
                       State('input-x-pie', 'value'),
                       State('input-names-pie', 'value'),
                       State('input-other-pie', 'value'))
    def update_pieplot(n_clicks, input1, input2, input3):
        input4 = None
        if strNoneConvert(input1) in df.columns:

            input_parametes = {"values": strNoneConvert(input1),
                               "names": strNoneConvert(input2),
                               "template": plot_theme,
                               "color_continuous_scale": plotly_color_continuous_scale}

            input_parametes.update(otherinputtodict(input3))

            fig = px.pie(df, **input_parametes)
            return dcc.Graph(
                id='graph-pie-tabs',
                figure=fig
            )
        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-tree', 'children'),
                       Input('submit-button-tree', 'n_clicks'),
                       State('input-x-tree', 'value'),
                       State('input-color-tree', 'value'),
                       State('input-value-tree', 'value'),
                       State('input-other-tree', 'value'))
    def update_treeplot(n_clicks, input1, input2, input3, input4):
        if not input1 is None:
            if set(input1).issubset(df.columns):
                input_parametes = {"color": strNoneConvert(input2),
                                   "values": strNoneConvert(input3),
                                   "template": plot_theme,
                                   "color_continuous_scale": plotly_color_continuous_scale}

                input_parametes.update(otherinputtodict(input4))

                fig = px.treemap(df, path=input1, **input_parametes)
                return dcc.Graph(
                    id='graph-tree-tabs',
                    figure=fig
                )

        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-sun', 'children'),
                       Input('submit-button-sun', 'n_clicks'),
                       State('input-x-sun', 'value'),
                       State('input-color-sun', 'value'),
                       State('input-value-sun', 'value'),
                       State('input-other-sun', 'value'))
    def update_sunplot(n_clicks, input1, input2, input3, input4):
        if not input1 is None:
            if set(input1).issubset(df.columns):

                input_parametes = {
                    "color": strNoneConvert(input2),
                    "values": strNoneConvert(input3),
                    "template": plot_theme,
                    "color_continuous_scale": plotly_color_continuous_scale}

                input_parametes.update(otherinputtodict(input4))

                fig = px.sunburst(df, path=input1, **input_parametes)
                return dcc.Graph(
                    id='graph-sun-tabs',
                    figure=fig
                )

        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-box', 'children'),
                       Input('submit-button-box', 'n_clicks'),
                       State('input-x-box', 'value'),
                       State('input-y-box', 'value'),
                       State('input-color-box', 'value'),
                       State('input-other-box', 'value'))
    def update_barplot(n_clicks, input1, input2, input3, input4):
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns:

            input_parametes = {"x": strNoneConvert(input1),
                               "y": strNoneConvert(input2),
                               "color": strNoneConvert(input3),
                               "template": plot_theme,
                               "color_continuous_scale": plotly_color_continuous_scale}
            input_parametes.update(otherinputtodict(input4))

            fig = px.box(df, **input_parametes)
            return dcc.Graph(
                id='graph-box-tabs',
                figure=fig
            )

        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-hist', 'children'),
                       Input('submit-button-hist', 'n_clicks'),
                       State('input-x-hist', 'value'),
                       State('input-color-hist', 'value'),
                       State('input-other-hist', 'value'))
    def update_histogram(n_clicks, input1, input2, input3):
        if not input1 is None:
            if input1 in df.columns:

                input_parametes = {"x": strNoneConvert(input1),
                                   "color": strNoneConvert(input2),
                                   "template": plot_theme,
                                   "color_continuous_scale": plotly_color_continuous_scale}

                input_parametes.update(otherinputtodict(input3))

                fig = px.histogram(df, **input_parametes)
                return dcc.Graph(
                    id='graph-hist-tabs',
                    figure=fig
                )

        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-area', 'children'),
                       Input('submit-button-area', 'n_clicks'),
                       State('input-x-area', 'value'),
                       State('input-y-area', 'value'),
                       State('input-color-area', 'value'),
                       State('input-line-group-area', 'value'),
                       State('input-other-area', 'value'))
    def update_areaplot(n_clicks, input1, input2, input3, input4, input5):
        input4 = None
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns:

            input_parametes = {"x": strNoneConvert(input1),
                               "y": strNoneConvert(input2),
                               "color": strNoneConvert(input3),
                               "line_group": strNoneConvert(input4),
                               "template": plot_theme,
                               "color_continuous_scale": plotly_color_continuous_scale}
            input_parametes.update(otherinputtodict(input5))

            fig = px.area(df, **input_parametes)
            return dcc.Graph(
                id='graph-area-tabs',
                figure=fig
            )
        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-heat', 'children'),
                       Input('submit-button-heat', 'n_clicks'),
                       State('input-x-heat', 'value'),
                       State('input-y-heat', 'value'),
                       State('input-color-heat', 'value'),
                       State('input-other-heat', 'value'))
    def update_heatplot(n_clicks, input1, input2, input3, input4):
        if not(input1 is None) and not(input2 is None):
            if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns:

                input_parametes = {"x": strNoneConvert(input1),
                                   "y": strNoneConvert(input2),
                                   "z": strNoneConvert(input3),
                                   "template": plot_theme,
                                   "color_continuous_scale": plotly_color_continuous_scale}
                input_parametes.update(otherinputtodict(input4))

                fig = px.density_heatmap(df, **input_parametes)
                return dcc.Graph(
                    id='graph-heat-tabs',
                    figure=fig
                )

        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-violin', 'children'),
                       Input('submit-button-violin', 'n_clicks'),
                       State('input-x-violin', 'value'),
                       State('input-y-violin', 'value'),
                       State('input-color-violin', 'value'),
                       State('input-other-violin', 'value'))
    def update_violinplot(n_clicks, input1, input2, input3, input4):
        if not(input1 is None):
            if strNoneConvert(input1) in df.columns:

                input_parametes = {"x": strNoneConvert(input2),
                                   "y": strNoneConvert(input1),
                                   "color": strNoneConvert(input3),
                                   "template": plot_theme,
                                   "color_continuous_scale": plotly_color_continuous_scale}
                input_parametes.update(otherinputtodict(input4))

                fig = px.violin(df, **input_parametes)
                return dcc.Graph(
                    id='graph-violin-tabs',
                    figure=fig
                )
        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-regscatter', 'children'),
                       Input('submit-button-regscatter', 'n_clicks'),
                       State('input-x-regscatter', 'value'),
                       State('input-y-regscatter', 'value'),
                       State('input-color-regscatter', 'value'),
                       State('input-size-regscatter', 'value'),
                       State('input-reg-regscatter', 'value'),
                       State('input-other-regscatter', 'value'))
    def update_regscatterplot(n_clicks, input1, input2, input3, input4, input5, input6):
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns:

            input_parametes = {"x": strNoneConvert(input1),
                               "y": strNoneConvert(input2),
                               "color": strNoneConvert(input3),
                               "size": strNoneConvert(input4),
                               "trendline": strNoneConvert(input5),
                               "template": plot_theme,
                               "color_continuous_scale": plotly_color_continuous_scale}
            input_parametes.update(otherinputtodict(input6))

            fig = px.scatter(df, **input_parametes)
            return dcc.Graph(
                id='graph-regscatter-tabs',
                figure=fig
            )

        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-map-line', 'children'),
                       Input('submit-button-map-line', 'n_clicks'),
                       State('input-map-line-location', 'value'),
                       State('input-map-line-color', 'value'),
                       State('input-other-map-line', 'value'))
    def update_maplineplot(n_clicks, input1, input2, input3):
        if strNoneConvert(input1) in df.columns:

            input_parametes = {"locations": strNoneConvert(input1),
                               "color": strNoneConvert(input2),
                               "template": plot_theme,
                               "color_continuous_scale": plotly_color_continuous_scale}
            input_parametes.update(otherinputtodict(input3))

            fig = px.line_geo(df, **input_parametes)
            return dcc.Graph(
                id='graph-map-line-tabs',
                figure=fig
            )
        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-map-scatter', 'children'),
                       Input('submit-button-map-scatter', 'n_clicks'),
                       State('input-map-scatter-location', 'value'),
                       State('input-map-scatter-color', 'value'),
                       State('input-map-scatter-size', 'value'),
                       State('input-other-map-scatter', 'value'))
    def update_mapscatterplot(n_clicks, input1, input2, input3, input4):
        input5 = None  # disabled due to mapbox token
        return "Disabled due to mapbox token"

    @dash_app.callback(Output('output-state-map-density', 'children'),
                       Input('submit-button-map-density', 'n_clicks'),
                       State('input-map-density-lat', 'value'),
                       State('input-map-density-lon', 'value'),
                       State('input-map-density-mag', 'value'),
                       State('input-map-density-radius', 'value'),
                       State('input-other-map-density', 'value'))
    def update_mapdensityplot(n_clicks, input1, input2, input3, input4, input5):
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns:

            input_parametes = {"lat": strNoneConvert(input1),
                               "lon": strNoneConvert(input2),
                               "z": strNoneConvert(input3),
                               "radius": floatNoneConvert(input4),
                               "zoom": 0,
                               "mapbox_style": "stamen-terrain",
                               "template": plot_theme,
                               "color_continuous_scale": plotly_color_continuous_scale}
            input_parametes.update(otherinputtodict(input5))

            fig = px.density_mapbox(df, **input_parametes)
            return dcc.Graph(
                id='graph-map-density-tabs',
                figure=fig
            )
        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-candlestick', 'children'),
                       Input('submit-button-candlestick', 'n_clicks'),
                       State('input-candlestick-date', 'value'),
                       State('input-candlestick-open', 'value'),
                       State('input-candlestick-high', 'value'),
                       State('input-candlestick-low', 'value'),
                       State('input-candlestick-close', 'value'),
                       State('input-other-candlestick', 'value'))
    def update_candlestick(n_clicks, input1, input2, input3, input4, input5, input6):
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns and strNoneConvert(input3) in df.columns and strNoneConvert(input4) in df.columns and strNoneConvert(input5) in df.columns:

            input_parametes = {"x": df[strNoneConvert(input1)],
                               "open": df[strNoneConvert(input2)],
                               "high": df[strNoneConvert(input3)],
                               "low": df[strNoneConvert(input4)],
                               "close": df[strNoneConvert(input5)]}
            input_parametes.update(otherinputtodict(input6))

            fig = go.Figure(data=[go.Candlestick(**input_parametes)])
            return dcc.Graph(
                id='graph-candlestick-tabs',
                figure=fig
            )
        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-ohlc', 'children'),
                       Input('submit-button-ohlc', 'n_clicks'),
                       State('input-ohlc-date', 'value'),
                       State('input-ohlc-open', 'value'),
                       State('input-ohlc-high', 'value'),
                       State('input-ohlc-low', 'value'),
                       State('input-ohlc-close', 'value'),
                       State('input-other-ohlc', 'value'))
    def update_ohlcstick(n_clicks, input1, input2, input3, input4, input5, input6):
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns and strNoneConvert(input3) in df.columns and strNoneConvert(input4) in df.columns and strNoneConvert(input5) in df.columns:

            input_parametes = {"x": df[strNoneConvert(input1)],
                               "open": df[strNoneConvert(input2)],
                               "high": df[strNoneConvert(input3)],
                               "low": df[strNoneConvert(input4)],
                               "close": df[strNoneConvert(input5)]}
            input_parametes.update(otherinputtodict(input6))

            fig = go.Figure(data=[go.Ohlc(**input_parametes)])
            return dcc.Graph(
                id='graph-ohlc-tabs',
                figure=fig
            )
        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-ternary', 'children'),
                       Input('submit-button-ternary', 'n_clicks'),
                       State('input-a-ternary', 'value'),
                       State('input-b-ternary', 'value'),
                       State('input-c-ternary', 'value'),
                       State('input-color-ternary', 'value'),
                       State('input-size-ternary', 'value'),
                       State('input-other-ternary', 'value'))
    def update_ternaryplot(n_clicks, input1, input2, input3, input4, input5, input6):
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns and strNoneConvert(input3) in df.columns:

            input_parametes = {"a": strNoneConvert(input1),
                               "b": strNoneConvert(input2),
                               "c": strNoneConvert(input3),
                               "color": strNoneConvert(input4),
                               "size": strNoneConvert(input5),
                               "template": plot_theme,
                               "color_continuous_scale": plotly_color_continuous_scale}
            input_parametes.update(otherinputtodict(input6))

            fig = px.scatter_ternary(df, **input_parametes)
            return dcc.Graph(
                id='graph-ternary-tabs',
                figure=fig
            )
        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-polar', 'children'),
                       Input('submit-button-polar', 'n_clicks'),
                       State('input-r-polar', 'value'),
                       State('input-theta-polar', 'value'),
                       State('input-color-polar', 'value'),
                       State('input-color-polar', 'value'),
                       State('input-symbol-polar', 'value'),
                       State('input-other-polar', 'value'))
    def update_polarplot(n_clicks, input1, input2, input3, input4, input5, input6):
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns:

            input_parametes = {"r": strNoneConvert(input1),
                               "theta": strNoneConvert(input2),
                               "color": strNoneConvert(input3),
                               "size": strNoneConvert(input4),
                               "symbol": strNoneConvert(input5),
                               "template": plot_theme,
                               "color_continuous_scale": plotly_color_continuous_scale}
            input_parametes.update(otherinputtodict(input6))

            fig = px.scatter_polar(df, **input_parametes)
            return dcc.Graph(
                id='graph-polar-tabs',
                figure=fig
            )

        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-streamtube', 'children'),
                       Input('submit-button-streamtube', 'n_clicks'),
                       State('input-x-streamtube', 'value'),
                       State('input-y-streamtube', 'value'),
                       State('input-z-streamtube', 'value'),
                       State('input-u-streamtube', 'value'),
                       State('input-v-streamtube', 'value'),
                       State('input-w-streamtube', 'value'),
                       State('input-other-streamtube', 'value'))
    def update_streamtubeplot(n_clicks, input1, input2, input3, input4, input5, input6, input7):
        if strNoneConvert(input1) in df.columns and strNoneConvert(input2) in df.columns and strNoneConvert(input3) in df.columns and strNoneConvert(input4) in df.columns and strNoneConvert(input5) in df.columns and strNoneConvert(input6) in df.columns:

            input_parametes = {"x": df[input1],
                               "y": df[input2],
                               "z": df[input3],
                               "u": df[input4],
                               "v": df[input5],
                               "w": df[input6],
                               "template": plot_theme,
                               "color_continuous_scale": plotly_color_continuous_scale}
            input_parametes.update(otherinputtodict(input7))

            fig = go.Figure(data=go.Streamtube(**input_parametes))
            return dcc.Graph(
                id='graph-streamtube-tabs',
                figure=fig
            )
        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    @dash_app.callback(Output('output-state-custom', 'children'),
                       Input('submit-button-custom', 'n_clicks'),
                       State('input-custom-code', 'value'))
    def update_customplot(n_clicks, input1):
        if not(input1 is None):
            df
            _locals = locals()
            exec(input1, globals(), _locals)
            return dcc.Graph(
                id='graph-custom-code-tabs',
                figure=_locals["fig"]
            )
        return "Fill the required fields and click on 'Submit' to generate the graph you want!!"

    return dash_app


def create_data_table(df):
    """Create Dash datatable from Pandas DataFrame."""
    table = dash_table.DataTable(
        id='database-table',
        columns=[{"name": i, "id": i} for i in df.columns],
        data=df.to_dict('records'),
        style_cell={'textAlign': 'center'},
        page_size=300
    )
    return table
